import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
	Box,
	Button,
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	Slider,
	Tab,
	Tabs,
	TextField,
	Typography,
	styled,
	Alert,
	CircularProgress,
	Paper,
} from '@mui/material';
import MuiInput from '@mui/material/Input';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Remarkable } from 'remarkable';
// Icons for UI elements

import { selectIsAdmin } from '../../features/auth/authSlice';
import { useCreateProblemMutation } from '../../services/api';

import { handleFileChange, renderMarkdown } from './utils';
import './styles.css';

// Styled component for the input
const Input = styled(MuiInput)`
	width: 42px;
`;

const CreateProblem = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [problemType, setProblemType] = useState('N/A');
	const [score, setScore] = useState(0);
	const [qnaAnswer, setQnaAnswer] = useState('');
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(100);
	const [answer, setAnswer] = useState(0);
	const [fileContent, setFileContent] = useState('');
	const [fileName, setFileName] = useState('');
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');
	const [tabValue, setTabValue] = useState(0);

	// Initialize Remarkable for markdown rendering
	const md = new Remarkable({
		html: false, // Enable HTML tags in source
		xhtmlOut: false, // Use '/' to close single tags (<br />)
		breaks: true, // Convert '\n' in paragraphs into <br>
		langPrefix: 'language-', // CSS language prefix for fenced blocks
		// eslint-disable-next-line
		linkify: true, // Auto-convert URL-like text to links
		typographer: true, // Enable smart punctuation and other transforms
	});

	const navigate = useNavigate();
	const isAdmin = useSelector(selectIsAdmin);

	// RTK Query create problem mutation
	const [createProblem, { isLoading }] = useCreateProblemMutation();

	// Check if user is admin
	useEffect(() => {
		if (!isAdmin) {
			navigate({
				pathname: '/home',
				state: { message: 'You need admin privileges to access this page' },
			});
		}
	}, [navigate, isAdmin]);

	const onSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setSuccessful(false);

		if (!title || !description || problemType === 'N/A') {
			setMessage('Please fill in all required fields');
			return;
		}

		try {
			// Prepare problem data based on type
			const problemData = {
				title: title.trim(),
				description: description.trim(),
				type: problemType,
				score,
			};

			// Add type-specific data
			if (problemType === 'Qna') {
				problemData.answer = qnaAnswer.trim();
			} else if (problemType === 'NumberGen') {
				problemData.min = min;
				problemData.max = max;
				problemData.answer = answer;
			} else if (problemType === 'gen') {
				problemData.fileContent = fileContent;
				problemData.fileName = fileName;
			}

			// Create problem using RTK Query
			const response = await createProblem(problemData).unwrap();
			setMessage(response.message || 'Problem created successfully!');
			setSuccessful(true);

			// Reset form after successful submission
			setTimeout(() => {
				setTitle('');
				setDescription('');
				setProblemType('N/A');
				setScore(0);
				setQnaAnswer('');
				setMin(0);
				setMax(100);
				setAnswer(0);
				setFileContent('');
				setFileName('');
				setSuccessful(false);
				setMessage('');
			}, 3000);
		} catch (error) {
			const errorMessage = error.data?.message || error.error || 'Failed to create problem. Please try again.';
			setMessage(errorMessage);
			setSuccessful(false);
		}
	};

	const handleScoreChange = (_, newValue) => {
		setScore(newValue);
	};

	const handleMinChange = (e) => {
		setMin(Number(e.target.value));
	};

	const handleMaxChange = (e) => {
		setMax(Number(e.target.value));
	};

	const handleAnswerChange = (e) => {
		setAnswer(Number(e.target.value));
	};

	const handleFileUpload = (e) => {
		handleFileChange(e, setFileContent, setFileName);
	};

	const handleTabChange = (_, newValue) => {
		setTabValue(newValue);
	};

	// Problem type icons are used directly in the UI

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Create Problem
				</Typography>

				{message && (
					<Alert severity={successful ? 'success' : 'error'} sx={{ mb: 2 }}>
						{message}
					</Alert>
				)}

				<form onSubmit={onSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								label="Title"
								variant="outlined"
								fullWidth
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</Grid>

						<Grid item xs={12}>
							<Box sx={{ mb: 2 }}>
								<Tabs
									value={tabValue}
									onChange={handleTabChange}
									aria-label="description tabs"
									sx={{ borderBottom: 1, borderColor: 'divider' }}
								>
									<Tab label="Edit" icon={<EditIcon />} id="tab-0" aria-controls="tabpanel-0" />
									<Tab label="Preview" icon={<PreviewIcon />} id="tab-1" aria-controls="tabpanel-1" />
								</Tabs>

								<div role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
									{tabValue === 0 && (
										<TextField
											label="Description (Markdown supported)"
											multiline
											rows={10}
											variant="outlined"
											fullWidth
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											required
											sx={{ mt: 2 }}
											placeholder="# Problem Description

Write your problem description here. Markdown is supported.

## Example

- Bullet points
- Lists

```
Code blocks
```

**Bold text** and *italic text*"
										/>
									)}
								</div>

								<div role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
									{tabValue === 1 && (
										<Paper
											elevation={1}
											sx={{
												p: 3,
												minHeight: '300px',
												backgroundColor: 'background.paper',
												mt: 2,
											}}
										>
											<div
												dangerouslySetInnerHTML={{
													__html: renderMarkdown(description, md),
												}}
											/>
										</Paper>
									)}
								</div>
							</Box>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormControl component="fieldset">
								<FormLabel component="legend">Problem Type</FormLabel>
								<RadioGroup row value={problemType} onChange={(e) => setProblemType(e.target.value)}>
									<FormControlLabel value="Qna" control={<Radio />} label="Q&A" />
									<FormControlLabel value="NumberGen" control={<Radio />} label="Number Generator" />
									<FormControlLabel value="gen" control={<Radio />} label="Code Generator" />
								</RadioGroup>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Box sx={{ width: 250 }}>
								<Typography id="score-slider" gutterBottom>
									Score
								</Typography>
								<Grid container spacing={2} alignItems="center">
									<Grid item xs>
										<Slider
											value={score}
											onChange={handleScoreChange}
											aria-labelledby="score-slider"
											valueLabelDisplay="auto"
											step={10}
											marks
											min={0}
											max={100}
										/>
									</Grid>
									<Grid item>
										<Input
											value={score}
											size="small"
											onChange={(e) => setScore(Number(e.target.value))}
											inputProps={{
												step: 10,
												min: 0,
												max: 100,
												type: 'number',
												'aria-labelledby': 'score-slider',
											}}
										/>
									</Grid>
								</Grid>
							</Box>
						</Grid>

						{problemType !== 'N/A' && (
							<Grid item xs={12}>
								<Typography variant="h6" gutterBottom>
									Problem Type Settings
								</Typography>
								<Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
									{problemType === 'Qna' && (
										<TextField
											label="Answer"
											variant="outlined"
											fullWidth
											value={qnaAnswer}
											onChange={(e) => setQnaAnswer(e.target.value)}
											required
											helperText="The correct answer for the Q&A problem"
										/>
									)}

									{problemType === 'NumberGen' && (
										<Grid container spacing={2}>
											<Grid item xs={12} sm={4}>
												<TextField
													label="Min"
													type="number"
													value={min}
													onChange={handleMinChange}
													fullWidth
													variant="outlined"
													helperText="Minimum value"
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<TextField
													label="Max"
													type="number"
													value={max}
													onChange={handleMaxChange}
													fullWidth
													variant="outlined"
													helperText="Maximum value"
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<TextField
													label="Answer"
													type="number"
													value={answer}
													onChange={handleAnswerChange}
													fullWidth
													variant="outlined"
													helperText="Correct answer"
												/>
											</Grid>
										</Grid>
									)}

									{problemType === 'gen' && (
										<Box>
											<Button
												variant="contained"
												component="label"
												startIcon={<UploadFileIcon />}
												sx={{ mb: 2 }}
											>
												Upload File
												<input
													type="file"
													hidden
													onChange={handleFileUpload}
													accept=".txt,.js,.py,.java,.c,.cpp"
												/>
											</Button>
											{fileName && (
												<Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
													{fileName}
												</Typography>
											)}
											<TextField
												label="File Content"
												multiline
												rows={10}
												variant="outlined"
												fullWidth
												value={fileContent}
												onChange={(e) => setFileContent(e.target.value)}
												sx={{ mt: 2 }}
											/>
										</Box>
									)}
								</Box>
							</Grid>
						)}

						<Grid item xs={12}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={isLoading}
								startIcon={isLoading ? <CircularProgress size={24} /> : null}
							>
								{isLoading ? 'Creating...' : 'Create Problem'}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default CreateProblem;
