import React, { useState, useEffect, useMemo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blue, purple, green } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types';

import AuthService from './services/auth.service';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import CreateProblem from './components/CreateProblem';
import ProbNumberGen from './components/ProbNumberGen';
import Standings from './components/Standings';
import AdminRoute from './components/common/AdminRoute';

import EventBus from './common/EventBus';
import Navbar from './components/Navbar/Navbar';

// Create protected route component
const ProtectedRoute = ({ component: Component, ...rest }) => {
	const currentUser = AuthService.getCurrentUser();

	return (
		<Route
			{...rest}
			render={(props) =>
				currentUser ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

ProtectedRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
	// We're intentionally not validating location prop as it comes from react-router
};

const App = () => {
	// We're keeping this state for future use but not using it currently
	// eslint-disable-next-line no-unused-vars
	const [showModeratorBoard, setShowModeratorBoard] = useState(false);
	const [showAdminBoard, setShowAdminBoard] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [mode, setMode] = useState(() => {
		// Try to get the theme mode from localStorage
		const savedMode = localStorage.getItem('themeMode');
		return savedMode || 'dark';
	});

	// Create a theme instance based on the current mode
	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					primary: {
						main: blue[700],
						light: blue[400],
						dark: blue[800],
					},
					secondary: {
						main: purple[500],
						light: purple[300],
						dark: purple[700],
					},
					success: {
						main: green[600],
						light: green[400],
						dark: green[800],
					},
					background: {
						default: mode === 'dark' ? '#121212' : '#f5f5f5',
						paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
					},
					text: {
						primary: mode === 'dark' ? '#ffffff' : '#000000',
						secondary: mode === 'dark' ? grey[400] : grey[700],
					},
				},
				typography: {
					fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
					useNextVariants: true,
				},
				shape: {
					borderRadius: 8,
				},
				components: {
					MuiButton: {
						styleOverrides: {
							root: {
								textTransform: 'none',
								fontWeight: 500,
							},
						},
					},
					MuiCard: {
						styleOverrides: {
							root: {
								borderRadius: 12,
								boxShadow:
									mode === 'dark'
										? '0 8px 16px 0 rgba(0, 0, 0, 0.4)'
										: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
							},
						},
					},
				},
			}),
		[mode],
	);

	// Toggle theme mode function
	const toggleThemeMode = () => {
		const newMode = mode === 'dark' ? 'light' : 'dark';
		setMode(newMode);
		localStorage.setItem('themeMode', newMode);
	};

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const user = AuthService.getCurrentUser();

				if (user) {
					setCurrentUser(user);
					setShowModeratorBoard(user.roles.includes('ROLE_MODERATOR'));
					setShowAdminBoard(user.roles.includes('ROLE_ADMIN'));
				}
			} catch (error) {
				console.error('Error initializing auth:', error);
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();

		EventBus.on('logout', () => {
			logOut();
		});

		return () => {
			EventBus.remove('logout');
		};
	}, []);

	const logOut = () => {
		AuthService.logout();
		setShowModeratorBoard(false);
		setShowAdminBoard(false);
		setCurrentUser(null);
	};

	if (loading) {
		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
					<div>Loading...</div>
				</Container>
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Navbar
				currentUser={currentUser}
				logOut={logOut}
				isAdmin={showAdminBoard}
				themeMode={mode}
				toggleThemeMode={toggleThemeMode}
			/>
			<Container>
				<Switch>
					{/* Public routes */}
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />

					{/* Protected routes for all authenticated users */}
					<ProtectedRoute exact path={['/', '/home']} component={Home} />
					<ProtectedRoute exact path="/profile" component={Profile} />
					<ProtectedRoute exact path="/standings" component={Standings} />
					<ProtectedRoute exact path="/ProbNumberGen/:id" component={ProbNumberGen} />

					{/* Admin-only routes */}
					<AdminRoute exact path="/createProb" component={CreateProblem} currentUser={currentUser} />

					{/* Fallback redirect */}
					<Redirect from="*" to="/" />
				</Switch>
			</Container>
		</ThemeProvider>
	);
};

export default App;
