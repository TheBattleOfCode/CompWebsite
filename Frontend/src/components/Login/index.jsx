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
import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import CheckButton from 'react-validation/build/button';
import Form from 'react-validation/build/form';

import { useLoginMutation } from '../../services';

import { validateRequired } from './utils';

const Login = () => {
	const theme = useTheme();
	const form = useRef();
	const checkBtn = useRef();
	const location = useLocation();
	const navigate = useNavigate();

	const [login, { isLoading }] = useLoginMutation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [notification, setNotification] = useState('');
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	// Check if user is already logged in or if there's a message from redirection
	useEffect(() => {
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
	}, [navigate, location]);

	const handleCloseNotification = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setNotificationOpen(false);
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
					const resMessage = (error.data && error.data.message) || error.message || error.toString();

					setMessage(resMessage);
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	};

	const handleRegisterClick = () => {
		navigate('/register');
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper
				elevation={3}
				sx={{
					marginTop: 8,
					padding: 3,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>

				<Box sx={{ mt: 1, width: '100%' }}>
					{message && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{message}
						</Alert>
					)}

					<Form onSubmit={handleLogin} ref={form}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							validations={[validateRequired]}
						/>

						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type={showPassword ? 'text' : 'password'}
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							validations={[validateRequired]}
							InputProps={{
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

						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
							{isLoading ? <CircularProgress size={24} /> : 'Sign In'}
						</Button>

						<CheckButton style={{ display: 'none' }} ref={checkBtn} />
					</Form>

					<Divider sx={{ my: 2 }}>
						<Typography variant="body2" color="text.secondary">
							OR
						</Typography>
					</Divider>

					<Button fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={handleRegisterClick}>
						Create an account
					</Button>

					<Box sx={{ mt: 2, textAlign: 'center' }}>
						<Link component={RouterLink} to="/forgot-password" variant="body2">
							Forgot password?
						</Link>
					</Box>
				</Box>
			</Paper>

			<Snackbar
				open={notificationOpen}
				autoHideDuration={6000}
				onClose={handleCloseNotification}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleCloseNotification} severity="info" sx={{ width: '100%' }}>
					{notification}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default Login;
