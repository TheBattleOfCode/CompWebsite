import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
	TextField,
	Button,
	Container,
	Alert,
	CircularProgress,
	Typography,
	Link,
	Box,
	Snackbar,
	Paper,
	Avatar,
	InputAdornment,
	IconButton,
	Divider,
	useTheme,
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import CheckButton from 'react-validation/build/button';
import Form from 'react-validation/build/form';

import { selectCurrentUser } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../services/api';

import { validateRequired } from './utils';

// We're not validating history props as they come from react-router
const Login = () => {
	const form = useRef();
	const checkBtn = useRef();
	const location = useLocation();
	const navigate = useNavigate();
	const theme = useTheme();
	const currentUser = useSelector(selectCurrentUser);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [notification, setNotification] = useState('');
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// RTK Query login mutation
	const [login, { isLoading }] = useLoginMutation();

	// Check if user is already logged in or if there's a message from redirection
	useEffect(() => {
		// If user is logged in, redirect to home
		if (currentUser) {
			navigate('/home');
			return;
		}

		// Check if there's a message from redirection
		if (location.state && location.state.message) {
			setNotification(location.state.message);
			setNotificationOpen(true);

			// Clear the message from location state to prevent showing it again on refresh
			const { message, ...rest } = location.state;
			navigate(
				{
					pathname: location.pathname,
					state: rest,
				},
				{ replace: true }
			);
		}
	}, [navigate, location, currentUser]);

	const handleInputChange = (e, setter) => {
		setter(e.target.value);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleLogin = (e) => {
		e.preventDefault();
		setMessage('');
		form.current.validateAll();

		if (checkBtn.current.context._errors.length === 0) {
			login({ username, password })
				.unwrap()
				.then(() => {
					// Redirect to the page the user was trying to access, or to home
					const { from } = location.state || { from: { pathname: '/home' } };
					navigate(from.pathname || '/home');
				})
				.catch((error) => {
					const resMessage =
						(error.data && error.data.message) || error.error || 'An error occurred during login';
					setMessage(resMessage);
				});
		}
	};

	const handleCloseNotification = () => {
		setNotificationOpen(false);
	};

	return (
		<Container maxWidth="sm">
			<Paper
				elevation={6}
				sx={{
					p: 4,
					mt: 8,
					borderRadius: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar
					sx={{
						m: 1,
						bgcolor: 'primary.main',
						width: 56,
						height: 56,
					}}
				>
					<LockOutlinedIcon fontSize="large" />
				</Avatar>

				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					sx={{
						fontWeight: 700,
						mb: 3,
					}}
				>
					Sign In
				</Typography>

				<Form onSubmit={handleLogin} ref={form} style={{ width: '100%' }}>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						margin="normal"
						value={username}
						onChange={(e) => handleInputChange(e, setUsername)}
						validations={[validateRequired]}
						autoFocus
						sx={{ mb: 2 }}
						InputProps={{
							sx: { borderRadius: 1.5 },
						}}
					/>

					<TextField
						label="Password"
						type={showPassword ? 'text' : 'password'}
						variant="outlined"
						fullWidth
						margin="normal"
						value={password}
						onChange={(e) => handleInputChange(e, setPassword)}
						validations={[validateRequired]}
						sx={{ mb: 3 }}
						InputProps={{
							sx: { borderRadius: 1.5 },
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						disabled={isLoading}
						sx={{
							py: 1.5,
							borderRadius: 1.5,
							fontSize: '1rem',
							textTransform: 'none',
							boxShadow: 3,
						}}
					>
						{isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
					</Button>

					{message && (
						<Alert
							severity="error"
							sx={{
								mt: 2,
								borderRadius: 1.5,
							}}
							variant="filled"
						>
							{message}
						</Alert>
					)}

					<Divider sx={{ my: 3 }}>
						<Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
							OR
						</Typography>
					</Divider>

					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<Typography variant="body1">
							Don&apos;t have an account?{' '}
							<Link
								component={RouterLink}
								to="/register"
								color="primary"
								sx={{
									fontWeight: 600,
									textDecoration: 'none',
									'&:hover': {
										textDecoration: 'underline',
									},
								}}
							>
								Sign Up
							</Link>
						</Typography>
					</Box>

					<CheckButton style={{ display: 'none' }} ref={checkBtn} />
				</Form>
			</Paper>

			{/* Notification for redirected users */}
			<Snackbar
				open={notificationOpen}
				autoHideDuration={6000}
				onClose={handleCloseNotification}
				message={notification}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			/>
		</Container>
	);
};

export default Login;
