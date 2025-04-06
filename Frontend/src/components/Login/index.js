import React, { useState, useRef, useEffect } from 'react';
import {
	TextField,
	Button,
	Container,
	Card,
	Alert,
	CircularProgress,
	Typography,
	Link,
	Box,
	Snackbar,
} from '@mui/material';
import Form from 'react-validation/build/form';
import CheckButton from 'react-validation/build/button';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { validateRequired } from './utils';

// We're not validating history props as they come from react-router
const Login = (props) => {
	const form = useRef();
	const checkBtn = useRef();
	const location = useLocation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [notification, setNotification] = useState('');
	const [notificationOpen, setNotificationOpen] = useState(false);

	// Check if user is already logged in or if there's a message from redirection
	useEffect(() => {
		const currentUser = AuthService.getCurrentUser();

		// If user is logged in, redirect to home
		if (currentUser) {
			props.history.push('/home');
			return;
		}

		// Check if there's a message from redirection
		if (location.state && location.state.message) {
			setNotification(location.state.message);
			setNotificationOpen(true);

			// Clear the message from location state to prevent showing it again on refresh
			// eslint-disable-next-line no-unused-vars
			const { message, ...rest } = location.state;
			props.history.replace({
				pathname: location.pathname,
				state: rest,
			});
		}
	}, [props.history, location]);

	const handleInputChange = (e, setter) => {
		setter(e.target.value);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		setMessage('');
		setLoading(true);
		form.current.validateAll();

		if (checkBtn.current.context._errors.length === 0) {
			AuthService.login(username, password)
				.then(() => {
					// Redirect to the page the user was trying to access, or to home
					const { from } = location.state || { from: { pathname: '/home' } };
					props.history.push(from.pathname || '/home');
				})
				.catch((error) => {
					const resMessage =
						(error.response && error.response.data && error.response.data.message) ||
						error.message ||
						error.toString();
					setMessage(resMessage);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	};

	const handleCloseNotification = () => {
		setNotificationOpen(false);
	};

	return (
		<Container maxWidth="sm">
			<Card variant="outlined" sx={{ padding: 3, marginTop: 4 }}>
				<Typography variant="h4" align="center" gutterBottom>
					Login
				</Typography>

				<Form onSubmit={handleLogin} ref={form}>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						margin="normal"
						value={username}
						onChange={(e) => handleInputChange(e, setUsername)}
						validations={[validateRequired]}
						autoFocus
					/>

					<TextField
						label="Password"
						type="password"
						variant="outlined"
						fullWidth
						margin="normal"
						value={password}
						onChange={(e) => handleInputChange(e, setPassword)}
						validations={[validateRequired]}
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						disabled={loading}
						sx={{ mt: 2, py: 1 }}
					>
						{loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
					</Button>

					{message && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{message}
						</Alert>
					)}

					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<Typography variant="body2">
							Don&apos;t have an account?{' '}
							<Link component={RouterLink} to="/register" color="primary">
								Register here
							</Link>
						</Typography>
					</Box>

					<CheckButton style={{ display: 'none' }} ref={checkBtn} />
				</Form>
			</Card>

			{/* Notification for redirected users */}
			<Snackbar
				open={notificationOpen}
				autoHideDuration={6000}
				onClose={handleCloseNotification}
				message={notification}
			/>
		</Container>
	);
};

export default Login;
