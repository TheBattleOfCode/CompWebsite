import React from 'react';
import { useParams } from 'react-router-dom';
import authService from '../services/auth.service';
import genProblemService from '../services/gen-problem.service';
import probService from '../services/prob.service';
import userService from '../services/user.service';
import { Container, Grid, Typography, Button, TextField, Alert } from '@mui/material';

function ProbNumberGen() {
	let { id } = useParams();
	const [prob, setProb] = React.useState([]);
	const [inOut, setInOut] = React.useState([]);
	const [generatedInOut, setGeneratedInOut] = React.useState([]);
	const [answerTry, setAnswerTry] = React.useState('');
	const currentUser = authService.getCurrentUser();

	function hash(input) {
		return input;
	}

	function generateInOut(code) {
		eval(code);
	}

	const getData = async () => {
		const currentProblem = probService.GetProb(id);
		const data = await currentProblem;
		setProb(data.data);

		const inOut = genProblemService.GetGenProb(currentUser.id, id);
		const dataInOut = await inOut;

		if (!dataInOut.data) {
			generateInOut(data.data.inOutContentGen);
		} else {
			setInOut({
				input: dataInOut.data.genInput,
				output: dataInOut.data.genOutput,
				answered: dataInOut.data.answered,
			});
		}
	};

	React.useEffect(() => {
		if (generatedInOut.output) {
			let encrypted = hash(generatedInOut.output);
			setInOut({ input: generatedInOut.input, output: encrypted, answered: false });
			genProblemService.SaveGenProb(generatedInOut.input.toString(), encrypted, currentUser.id, id).then(
				(response) => {
					console.log(response);
				},
				(error) => {
					console.log(error);
				},
			);
		}
	}, [generatedInOut]);

	React.useEffect(() => {
		getData();
	}, []);

	function submitAnswer() {
		let encrypted = hash(answerTry.trim().toUpperCase());

		if (encrypted === inOut.output) {
			setInOut({
				input: inOut.input,
				output: answerTry.trim().toUpperCase(),
				answered: true,
			});
			genProblemService.UpdateGenProb(currentUser.id, id, answerTry).then(
				(response) => {
					console.log(response);
				},
				(error) => {
					console.log(error);
				},
			);

			userService
				.UpdateUser(currentUser.id, {
					indivScore: currentUser.indivScore + prob.score,
					countSolved: currentUser.countSolved + 1,
				})
				.then((response) => {
					console.log(response);
				});
			currentUser.countSolved += 1;
			currentUser.indivScore = currentUser.indivScore + prob.score;
			localStorage.setItem('user', JSON.stringify(currentUser));
		} else {
			alert('Incorrect!');
		}
	}

	return (
		<Container>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h1" align="center">
						{prob.title} ({prob.score} points)
					</Typography>
					<Typography variant="h3">Description</Typography>
					<div dangerouslySetInnerHTML={{ __html: prob.description }}></div>
				</Grid>
				{!!currentUser && (
					<Grid item xs={12}>
						{prob.type === 'NumberGen' && (
							<div>
								<Typography variant="h4">Click to get your input</Typography>
								<Button
									onClick={() => navigator.clipboard.writeText(inOut.input)}
									variant="contained"
									color="warning"
								>
									Copy
								</Button>
							</div>
						)}
						{!inOut.answered && (
							<div>
								<TextField
									label="Submission"
									variant="outlined"
									fullWidth
									value={answerTry}
									onChange={(e) => setAnswerTry(e.target.value)}
								/>
								<Button
									variant="contained"
									color="primary"
									onClick={submitAnswer}
									style={{ marginTop: '16px' }}
								>
									Submit
								</Button>
							</div>
						)}
						{inOut.answered && (
							<Alert severity="success">You answered correctly! Your answer was {inOut.output}</Alert>
						)}
					</Grid>
				)}
				{!currentUser && (
					<Grid item xs={12}>
						<Typography>
							To get an Input and get solving, <a href="login.php">login</a> or{' '}
							<a href="signup.php">signup</a>.
						</Typography>
					</Grid>
				)}
				<Grid item xs={12}>
					<footer>
						<Typography>&copy; 2022 FFDV, inc.</Typography>
					</footer>
				</Grid>
			</Grid>
		</Container>
	);
}

export default ProbNumberGen;
