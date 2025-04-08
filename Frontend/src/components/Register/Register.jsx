import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
	TextField,
	Button,
	Container,
	Alert,
	Typography,
	Link,
	Box,
	CircularProgress,
	Paper,
	Avatar,
	InputAdornment,
	IconButton,
	Divider,
	useTheme,
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CheckButton from 'react-validation/build/button';
import Form from 'react-validation/build/form';

import { selectCurrentUser } from '../../features/auth/authSlice';
import { useRegisterMutation } from '../../services/api';

import { validateRequired, validateEmail, validateUsername, validatePassword } from './utils';

// We're not validating history props as they come from react-router
const Register = () => {
	const form = useRef();
	const checkBtn = useRef();
	const theme = useTheme();
	const currentUser = useSelector(selectCurrentUser);
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// RTK Query register mutation
	const [register, { isLoading }] = useRegisterMutation();

	// Check if user is already logged in
	useEffect(() => {
		if (currentUser) {
			navigate('/home');
		}
	}, [navigate, currentUser]);

	const handleUsernameChange = (e) => {
		setUsername(e.target.value.trim().toUpperCase());
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value.trim().toLowerCase());
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleRegister = (e) => {
		e.preventDefault();
		setMessage('');
		setSuccessful(false);
		form.current.validateAll();

		if (checkBtn.current.context._errors.length === 0) {
			register({ username, email, password })
				.unwrap()
				.then((response) => {
					setMessage(response.message || 'Registration successful!');
					setSuccessful(true);
					// Redirect to login after 3 seconds
					setTimeout(() => {
						navigate('/login');
					}, 3000);
				})
				.catch((error) => {
					const resMessage =
						(error.data && error.data.message) || error.error || 'An error occurred during registration';
					setMessage(resMessage);
					setSuccessful(false);
				});
		}
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
						bgcolor: 'secondary.main',
						width: 56,
						height: 56,
					}}
				>
					<PersonAddIcon fontSize="large" />
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
					Sign Up
				</Typography>

				<Form onSubmit={handleRegister} ref={form} style={{ width: '100%' }}>
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
								sx={{ mb: 2 }}
								InputProps={{
									sx: { borderRadius: 1.5 },
								}}
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
								onChange={handlePasswordChange}
								validations={[validateRequired, validatePassword]}
								helperText="Password must be between 6 and 40 characters"
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
								color="secondary"
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
								{isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
							</Button>
						</div>
					)}

					{message && (
						<Alert
							severity={successful ? 'success' : 'error'}
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
							Already have an account?{' '}
							<Link
								component={RouterLink}
								to="/login"
								color="primary"
								sx={{
									fontWeight: 600,
									textDecoration: 'none',
									'&:hover': {
										textDecoration: 'underline',
									},
								}}
							>
								Sign In
							</Link>
						</Typography>
					</Box>

					<CheckButton style={{ display: 'none' }} ref={checkBtn} />
				</Form>
			</Paper>
		</Container>
	);
};

export default Register;
