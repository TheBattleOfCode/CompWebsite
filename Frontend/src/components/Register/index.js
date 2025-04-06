import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Container, Card, Alert, Typography, Link, Box, CircularProgress } from '@mui/material';
import Form from 'react-validation/build/form';
import CheckButton from 'react-validation/build/button';
import { Link as RouterLink } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { validateRequired, validateEmail, validateUsername, validatePassword } from './utils';

// We're not validating history props as they come from react-router
const Register = (props) => {
	const form = useRef();
	const checkBtn = useRef();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	// Check if user is already logged in
	useEffect(() => {
		const currentUser = AuthService.getCurrentUser();
		if (currentUser) {
			props.history.push('/home');
		}
	}, [props.history]);

	const handleUsernameChange = (e) => {
		setUsername(e.target.value.trim().toUpperCase());
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value.trim().toLowerCase());
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleRegister = (e) => {
		e.preventDefault();
		setMessage('');
		setSuccessful(false);
		setLoading(true);
		form.current.validateAll();

		if (checkBtn.current.context._errors.length === 0) {
			AuthService.register(username, email, password)
				.then((response) => {
					setMessage(response.data.message);
					setSuccessful(true);
					// Redirect to login after 3 seconds
					setTimeout(() => {
						props.history.push('/login');
					}, 3000);
				})
				.catch((error) => {
					const resMessage =
						(error.response && error.response.data && error.response.data.message) ||
						error.message ||
						error.toString();
					setMessage(resMessage);
					setSuccessful(false);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm">
			<Card variant="outlined" sx={{ padding: 3, marginTop: 4 }}>
				<Typography variant="h4" align="center" gutterBottom>
					Register
				</Typography>

				<Form onSubmit={handleRegister} ref={form}>
					{!successful && (
						<div>
							<TextField
								label="Username"
								variant="outlined"
								fullWidth
								margin="normal"
								value={username}
								onChange={handleUsernameChange}
								validations={[validateRequired, validateUsername]}
								autoFocus
								helperText="Username must be between 3 and 20 characters"
							/>

							<TextField
								label="Email"
								variant="outlined"
								fullWidth
								margin="normal"
								value={email}
								onChange={handleEmailChange}
								validations={[validateRequired, validateEmail]}
								helperText="Please enter a valid email address"
							/>

							<TextField
								label="Password"
								type="password"
								variant="outlined"
								fullWidth
								margin="normal"
								value={password}
								onChange={handlePasswordChange}
								validations={[validateRequired, validatePassword]}
								helperText="Password must be between 6 and 40 characters"
							/>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								disabled={loading}
								sx={{ mt: 2, py: 1 }}
							>
								{loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
							</Button>
						</div>
					)}

					{message && (
						<Alert severity={successful ? 'success' : 'error'} sx={{ mt: 2 }}>
							{message}
						</Alert>
					)}

					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<Typography variant="body2">
							Already have an account?{' '}
							<Link component={RouterLink} to="/login" color="primary">
								Login here
							</Link>
						</Typography>
					</Box>

					<CheckButton style={{ display: 'none' }} ref={checkBtn} />
				</Form>
			</Card>
		</Container>
	);
};

export default Register;
