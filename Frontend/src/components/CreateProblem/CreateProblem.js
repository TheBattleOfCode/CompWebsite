import React, { useState, useEffect } from 'react';
import { Remarkable } from 'remarkable';
import MuiInput from '@mui/material/Input';
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
	TextField,
	Typography,
	styled,
	Alert,
	CircularProgress,
	Paper,
	Tabs,
	Tab,
	Divider,
	Card,
	CardContent,
	Chip,
	useTheme,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import QuizIcon from '@mui/icons-material/Quiz';
import CalculateIcon from '@mui/icons-material/Calculate';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateProblemMutation } from '../../services/api';
import { selectIsAdmin } from '../../features/auth/authSlice';
import { handleFileChange, renderMarkdown } from './utils';
import './styles.css';

const Input = styled(MuiInput)`
	width: 42px;
`;

const CreateProblem = () => {
	const [problemType, setProblemType] = useState('N/A');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [score, setScore] = useState(0);
	const [qnaAnswer, setQnaAnswer] = useState('');
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');
	const [tabValue, setTabValue] = useState(0);

	// For NumberGen type
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(100);
	const [answer, setAnswer] = useState(0);

	// For file upload
	const [fileContent, setFileContent] = useState('');
	const [fileName, setFileName] = useState('');

	const md = new Remarkable({
		html: false, // Enable HTML tags in source
		xhtmlOut: false, // Use '/' to close single tags (<br />)
		breaks: true, // Convert '\n' in paragraphs into <br>
		langPrefix: 'language-', // CSS language prefix for fenced blocks
		linkify: true, // Autoconvert URL-like text to links
		typographer: true, // Enable smartypants and other sweet transforms
	});

	const history = useHistory();
	const theme = useTheme();
	const isAdmin = useSelector(selectIsAdmin);

	// RTK Query create problem mutation
	const [createProblem, { isLoading }] = useCreateProblemMutation();

	// Check if user is admin
	useEffect(() => {
		if (!isAdmin) {
			history.push({
				pathname: '/home',
				state: { message: 'You need admin privileges to access this page' },
			});
		}
	}, [history, isAdmin]);

	const onSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setSuccessful(false);

		// Validate form
		if (!title.trim()) {
			setMessage('Title is required');
			return;
		}

		if (!description.trim()) {
			setMessage('Description is required');
			return;
		}

		if (problemType === 'N/A') {
			setMessage('Please select a problem type');
			return;
		}

		// Prepare problem data based on type
		const problemData = {
			title: title.trim(),
			description: description.trim(),
			type: problemType,
			score,
		};

		// Add type-specific data
		if (problemType === 'NumberGen') {
			problemData.min = min;
			problemData.max = max;
			problemData.answer = answer;
		} else if (problemType === 'Qna') {
			problemData.answer = qnaAnswer.trim();
		} else if (problemType === 'gen' && fileContent) {
			problemData.file = fileContent;
		}

		try {
			const response = await createProblem(problemData).unwrap();
			setMessage(response.message || 'Problem created successfully!');
			setSuccessful(true);

			// Reset form after successful creation
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

	const handleScoreChange = (event, newValue) => {
		setScore(newValue);
	};

	const handleScoreInputChange = (event) => {
		setScore(event.target.value === '' ? 0 : Number(event.target.value));
	};

	const handleMinChange = (event) => {
		setMin(Number(event.target.value));
	};

	const handleMaxChange = (event) => {
		setMax(Number(event.target.value));
	};

	const handleAnswerChange = (event) => {
		setAnswer(Number(event.target.value));
	};

	const handleFileUpload = (e) => {
		handleFileChange(e, setFileContent, setFileName);
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	// Get problem type icon
	const getProblemTypeIcon = (type) => {
		switch (type) {
			case 'NumberGen':
				return <CalculateIcon />;
			case 'Qna':
				return <QuizIcon />;
			case 'gen':
				return <CodeIcon />;
			default:
				return null;
		}
	};

	if (!isAdmin) {
		return null; // Will redirect in useEffect
	}

	return (
		<Container>
			<Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3, borderRadius: 2 }}>
				<Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
					Create Problem
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" gutterBottom>
					Admin access required
				</Typography>

				<Divider sx={{ my: 2 }} />

				<form onSubmit={onSubmit}>
					<Grid container spacing={3}>
						{/* Problem Type Selection */}
						<Grid item xs={12}>
							<FormControl component="fieldset">
								<FormLabel component="legend">Problem Type</FormLabel>
								<RadioGroup
									row
									value={problemType}
									onChange={(e) => setProblemType(e.target.value)}
									sx={{ mt: 1 }}
								>
									<FormControlLabel
										value="gen"
										control={<Radio color="primary" />}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<CodeIcon sx={{ mr: 0.5 }} />
												General
											</Box>
										}
									/>
									<FormControlLabel
										value="NumberGen"
										control={<Radio color="secondary" />}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<CalculateIcon sx={{ mr: 0.5 }} />
												Number Generator
											</Box>
										}
									/>
									<FormControlLabel
										value="Qna"
										control={<Radio color="success" />}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<QuizIcon sx={{ mr: 0.5 }} />
												Q&A
											</Box>
										}
									/>
								</RadioGroup>
							</FormControl>
						</Grid>

						{/* Title */}
						<Grid item xs={12}>
							<TextField
								label="Title"
								variant="outlined"
								fullWidth
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								sx={{ mb: 2 }}
							/>
						</Grid>

						{/* Description with Tabs for Edit/Preview */}
						<Grid item xs={12}>
							<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
								<Tabs value={tabValue} onChange={handleTabChange} aria-label="description tabs">
									<Tab icon={<EditIcon />} label="Edit" id="tab-0" aria-controls="tabpanel-0" />
									<Tab icon={<PreviewIcon />} label="Preview" id="tab-1" aria-controls="tabpanel-1" />
								</Tabs>
							</Box>

							<div role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
								{tabValue === 0 && (
									<TextField
										label="Description (Markdown supported)"
										variant="outlined"
										fullWidth
										multiline
										rows={10}
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										required
										placeholder="# Problem Title
## Description
Write your problem description here. You can use Markdown formatting:

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
											backgroundColor:
												theme.palette.mode === 'dark'
													? 'rgba(255, 255, 255, 0.05)'
													: 'rgba(0, 0, 0, 0.02)',
											borderRadius: 2,
										}}
									>
										{description ? (
											<div
												className="markdown-body"
												dangerouslySetInnerHTML={{ __html: renderMarkdown(description, md) }}
											/>
										) : (
											<Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
												No content to preview. Start typing in the Edit tab to see a preview
												here.
											</Typography>
										)}
									</Paper>
								)}
							</div>
						</Grid>

						{/* Score */}
						<Grid item xs={12} md={6}>
							<Card sx={{ p: 2 }}>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Problem Score
									</Typography>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Set the difficulty score for this problem (0-100)
									</Typography>
									<Box sx={{ width: '100%', mt: 2 }}>
										<Grid container spacing={2} alignItems="center">
											<Grid item xs>
												<Slider
													value={typeof score === 'number' ? score : 0}
													onChange={handleScoreChange}
													aria-labelledby="input-slider"
													min={0}
													max={100}
													marks={[
														{ value: 0, label: 'Easy' },
														{ value: 50, label: 'Medium' },
														{ value: 100, label: 'Hard' },
													]}
												/>
											</Grid>
											<Grid item>
												<Input
													value={score}
													size="small"
													onChange={handleScoreInputChange}
													inputProps={{
														step: 10,
														min: 0,
														max: 100,
														type: 'number',
														'aria-labelledby': 'input-slider',
													}}
												/>
											</Grid>
										</Grid>
									</Box>
								</CardContent>
							</Card>
						</Grid>

						{/* Type-specific inputs */}
						<Grid item xs={12} md={6}>
							{problemType !== 'N/A' && (
								<Card sx={{ p: 2, height: '100%' }}>
									<CardContent>
										<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
											{getProblemTypeIcon(problemType)}
											<Typography variant="h6" sx={{ ml: 1 }}>
												{problemType === 'gen' && 'General Problem Settings'}
												{problemType === 'NumberGen' && 'Number Generator Settings'}
												{problemType === 'Qna' && 'Q&A Settings'}
											</Typography>
										</Box>

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

										{problemType === 'Qna' && (
											<TextField
												label="Answer"
												variant="outlined"
												fullWidth
												value={qnaAnswer}
												onChange={(e) => setQnaAnswer(e.target.value)}
												helperText="The correct answer to the question"
											/>
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
													<input type="file" hidden onChange={handleFileUpload} />
												</Button>
												<Box sx={{ mt: 2 }}>
													{fileName ? (
														<Chip label={fileName} color="primary" variant="outlined" />
													) : (
														<Typography variant="body2" color="text.secondary">
															No file chosen
														</Typography>
													)}
												</Box>
											</Box>
										)}
									</CardContent>
								</Card>
							)}
						</Grid>

						{/* Submit Button */}
						<Grid item xs={12}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={isLoading || problemType === 'N/A'}
								sx={{ mt: 2, py: 1.5, px: 4, borderRadius: 2 }}
								size="large"
							>
								{isLoading ? <CircularProgress size={24} /> : 'Create Problem'}
							</Button>
						</Grid>

						{/* Status Message */}
						{message && (
							<Grid item xs={12}>
								<Alert severity={successful ? 'success' : 'error'} sx={{ mt: 2 }} variant="filled">
									{message}
								</Alert>
							</Grid>
						)}
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default CreateProblem;
