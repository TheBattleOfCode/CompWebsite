import { Container, Grid, Typography, Button, TextField, Alert } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Remarkable } from 'remarkable';

import authService from '../../services/auth.service';
import genProblemService from '../../services/gen-problem.service';
import probService from '../../services/prob.service';
import userService from '../../services/user.service';

import { generateInOut, handleAnswerSubmit } from './utils';

function ProbNumberGen() {
	const { id } = useParams();
	const [problem, setProblem] = useState(null);
	const [userProblemData, setUserProblemData] = useState(null);
	const [generatedData, setGeneratedData] = useState(null);
	const [answer, setAnswer] = useState('');
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState('info');
	const [loading, setLoading] = useState(true);

	const currentUser = authService.getCurrentUser();
	const md = new Remarkable();

	// Fetch problem and user data
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch problem data
				const problemResponse = await probService.GetProb(id);
				setProblem(problemResponse.data);

				// Fetch user's problem data
				const userProblemResponse = await genProblemService.GetGenProb(currentUser.id, id);
				setUserProblemData(userProblemResponse.data);

				// Generate problem data if needed
				if (problemResponse.data.type === 'gen' && problemResponse.data.file) {
					const generatedResult = generateInOut(problemResponse.data.file);
					setGeneratedData(generatedResult);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
				setMessage('Error loading problem data');
				setMessageType('error');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id, currentUser.id]);

	const submitAnswer = async () => {
		setLoading(true);

		try {
			const result = await handleAnswerSubmit({
				problem,
				answer,
				currentUser,
				userProblemData,
				genProblemService,
				userService,
			});

			setMessage(result.message);
			setMessageType(result.success ? 'success' : 'error');

			// Refresh user problem data after submission
			if (result.success) {
				const updatedUserProblemResponse = await genProblemService.GetGenProb(currentUser.id, id);
				setUserProblemData(updatedUserProblemResponse.data);
			}
		} catch (error) {
			console.error('Error submitting answer:', error);
			setMessage('Error submitting answer');
			setMessageType('error');
		} finally {
			setLoading(false);
		}
	};

	if (loading && !problem) {
		return (
			<Container>
				<Typography variant="h5">Loading problem...</Typography>
			</Container>
		);
	}

	if (!problem) {
		return (
			<Container>
				<Typography variant="h5">Problem not found</Typography>
			</Container>
		);
	}

	return (
		<Container>
			<Grid container spacing={3}>
				{/* Problem Title */}
				<Grid item xs={12}>
					<Typography variant="h4">{problem.title}</Typography>
					<Typography variant="subtitle1">
						Type: {problem.type} | Score: {problem.score}
					</Typography>
				</Grid>

				{/* Problem Description */}
				<Grid item xs={12}>
					<Typography variant="h5">Description</Typography>
					<div
						dangerouslySetInnerHTML={{
							__html: md.render(problem.description || ''),
						}}
					/>
				</Grid>

				{/* Problem-specific UI */}
				{problem.type === 'NumberGen' && (
					<Grid item xs={12}>
						<Typography variant="h5">Number Generator Problem</Typography>
						<Typography>
							Generate a number between {problem.min} and {problem.max}
						</Typography>
					</Grid>
				)}

				{problem.type === 'gen' && generatedData && (
					<Grid item xs={12}>
						<Typography variant="h5">Generated Data</Typography>
						<pre>{JSON.stringify(generatedData, null, 2)}</pre>
					</Grid>
				)}

				{/* Answer Input */}
				<Grid item xs={12}>
					<TextField
						label="Your Answer"
						variant="outlined"
						fullWidth
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						disabled={userProblemData?.answered}
					/>
				</Grid>

				{/* Submit Button */}
				<Grid item xs={12}>
					<Button
						variant="contained"
						color="primary"
						onClick={submitAnswer}
						disabled={loading || userProblemData?.answered}
					>
						Submit Answer
					</Button>
				</Grid>

				{/* Status Message */}
				{message && (
					<Grid item xs={12}>
						<Alert severity={messageType}>{message}</Alert>
					</Grid>
				)}

				{/* Previous Attempts */}
				{userProblemData && (
					<Grid item xs={12}>
						<Typography variant="h5">Your Submission</Typography>
						<Typography>Status: {userProblemData.answered ? 'Solved' : 'Not solved yet'}</Typography>
						{userProblemData.answered && <Typography>Congratulations! You solved this problem.</Typography>}
						{userProblemData.tries > 0 && <Typography>Attempts: {userProblemData.tries}</Typography>}
					</Grid>
				)}
			</Grid>
		</Container>
	);
}

export default ProbNumberGen;
