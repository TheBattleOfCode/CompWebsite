import React, { useState } from 'react';
import probService from '../services/prob.service';
import { Remarkable } from 'remarkable';
import MuiInput from '@mui/material/Input';
import {
	AccordionDetails,
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
} from '@mui/material';

const CreateProblem = () => {
	const [selectValue, setSelectValue] = useState('N/A');
	const [probTitle, setProbTitle] = useState('');
	const [probDesc, setProbDesc] = useState('');
	const [probScore, setProbScore] = useState(0);
	const [probFile, setProbFile] = useState('');
	const [probQnaAnswer, setProbQnaAnswer] = useState('');
	const [successful, setSuccessful] = useState(false);
	const [fail, setFail] = useState(false);

	const Input = styled(MuiInput)`
		width: 42px;
	`;

	const handleProblemTypeChange = (event) => {
		setSelectValue(event.target.value);
	};

	const onFormSubmit = (event) => {
		switch (selectValue) {
			case 'Number gen':
				submitNumberGen(event);
				break;
			case 'QnA':
				submitQnA(event);
				break;
		}
	};

	const handleSliderChange = (event, newValue) => {
		setProbScore(newValue);
	};

	const handleScoreBlur = () => {
		if (probScore < 0) {
			setProbScore(0);
		} else if (probScore > 1000) {
			setProbScore(1000);
		}
	};

	const handleScoreChange = (event) => {
		setProbScore(event.target.value === '' ? '' : Number(event.target.value));
	};

	const onTitleChange = (event) => {
		setProbTitle(event.target.value);
	};

	const onDescriptionChange = (event) => {
		setProbDesc(event.target.value);
	};

	const submitNumberGen = (event) => {
		event.preventDefault();
		const md = new Remarkable();
		probService.SaveProb(probTitle, md.render(probDesc), probScore, probFile, 'NumberGen').then(
			(response) => {
				console.log(response);
				setSuccessful(true);
				setFail(false);
			},
			(error) => {
				console.log(error);
				setFail(true);
				setSuccessful(false);
			},
		);

		setProbDesc('');
		setProbTitle('');
		setProbScore(0);
		setProbFile('');
	};

	const submitQnA = (event) => {
		event.preventDefault();
		const md = new Remarkable();
		let file =
			'function generateInput(){return "";}function generateOutput(input){return "' +
			probQnaAnswer.trim().toUpperCase() +
			'";}const input=generateInput();setGeneratedInOut({"input":input,"output":generateOutput(input)});';
		probService.SaveProb(probTitle, md.render(probDesc), probScore, file, 'Qna').then(
			(response) => {
				console.log(response);
				setSuccessful(true);
				setFail(false);
			},
			(error) => {
				console.log(error);
				setFail(true);
				setSuccessful(false);
			},
		);

		setProbDesc('');
		setProbTitle('');
		setProbScore(0);
		setProbFile('');
		setProbQnaAnswer('');
	};

	const submitButton = () => {
		return (
			<div>
				<div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
					<Button variant="contained" type="submit">
						Submit
					</Button>
				</div>

				{successful && <Alert severity="success">Problem created successfully!</Alert>}
				{fail && <Alert severity="error">Problem creation failed!</Alert>}
			</div>
		);
	};

	const numberGenInput = () => {
		return (
			<div>
				<div className="form-group">
					<label htmlFor="File">
						<details>
							<summary>File (Generator)</summary>
							<p>
								Get your code template{' '}
								<a target="_blank" href="https://jsfiddle.net/TheOtherAKS/81tdm9fh/2/">
									here
								</a>
							</p>
						</details>
					</label>
					<textarea
						type="text"
						className="form-control"
						name="File"
						id="File"
						value={probFile}
						onChange={(e) => setProbFile(e.target.value)}
						required
					/>
				</div>
			</div>
		);
	};

	const QnAInput = () => {
		return (
			<div>
				<div className="form-group">
					<label htmlFor="File">
						<details>
							<summary>Answer</summary>
							<p>Your answer will be case insensitive</p>
						</details>
					</label>
					<textarea
						type="text"
						className="form-control"
						name="File"
						id="File"
						value={probQnaAnswer}
						onChange={(e) => setProbQnaAnswer(e.target.value)}
						required
					/>
				</div>
			</div>
		);
	};

	const SelectInput = () => {
		return (
			<Box>
				<FormControl>
					<FormLabel id="demo-controlled-radio-buttons-group">Problem Type</FormLabel>
					<RadioGroup
						aria-labelledby="demo-controlled-radio-buttons-group"
						name="controlled-radio-buttons-group"
						value={selectValue}
						onChange={handleProblemTypeChange}
					>
						<FormControlLabel value="Number gen" control={<Radio />} label="Number generator" />
						<FormControlLabel value="QnA" control={<Radio />} label="QnA" />
						<FormControlLabel
							value="Compiler (under Construction)"
							control={<Radio />}
							label="Compiler (under Construction)"
						/>
						<FormControlLabel
							value="File Generator (under Construction)"
							control={<Radio />}
							label="File Generator (under Construction)"
						/>
					</RadioGroup>
				</FormControl>
			</Box>
		);
	};

	return (
		<Container sx={{ marginTop: '64px' }}>
			<Grid container spacing={8} sx={{ padding: '24px' }}>
				<Grid item xs={9}>
					<Typography variant="h1">Create Problem</Typography>
					<Typography variant="h2">{`Select the problem style : ${selectValue ? selectValue : ''}`}</Typography>
					<form onSubmit={onFormSubmit}>
						<Typography variant="h6">Problem Title</Typography>
						<TextField
							label="Title"
							variant="outlined"
							value={probTitle}
							onChange={onTitleChange}
							required
						/>

						<AccordionDetails>
							<Typography>
								Write in Markdown, seek documentation{' '}
								<a
									target="_blank"
									href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
								>
									here
								</a>
							</Typography>
						</AccordionDetails>

						<Typography variant="h6">Problem Description</Typography>
						<TextField
							id="outlined-basic"
							label="Description"
							variant="outlined"
							value={probDesc}
							onChange={onDescriptionChange}
							required
						/>

						<Grid container spacing={2} alignItems="center">
							<Grid item xs>
								<Slider
									value={typeof probScore === 'number' ? probScore : 0}
									onChange={handleSliderChange}
									aria-labelledby="input-slider"
									defaultValue={0}
									step={50}
									min={0}
									max={1000}
								/>
							</Grid>
							<Grid item>
								<Input
									value={probScore}
									size="small"
									onChange={handleScoreChange}
									onBlur={handleScoreBlur}
									inputProps={{
										step: 10,
										min: 0,
										max: 1000,
										type: 'number',
										'aria-labelledby': 'input-slider',
									}}
								/>
							</Grid>
						</Grid>
						{selectValue === 'Number gen' && numberGenInput()}
						{selectValue === 'QnA' && QnAInput()}
						{selectValue !== 'N/A' && submitButton()}
					</form>
				</Grid>
				<Grid
					item
					xs
					sx={{
						p: 2,
						border: '3px double black',
						borderRadius: '8px',
						paddingTop: '0px',
						marginLeft: '16px',
						marginRight: '-32px',
					}}
				>
					<SelectInput />
				</Grid>
			</Grid>
		</Container>
	);
};

export default CreateProblem;
