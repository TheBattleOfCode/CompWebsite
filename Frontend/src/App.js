import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
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

	const theme = createTheme({
		palette: {
			mode: 'dark',
			primary: {
				main: '#1976d2',
			},
			secondary: {
				main: '#9c27b0',
			},
			success: {
				main: '#66bb6a',
			},
			default: {
				main: grey[300],
				dark: grey[400],
			},
		},
		typography: {
			useNextVariants: true,
		},
	});

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
			<Navbar currentUser={currentUser} logOut={logOut} isAdmin={showAdminBoard} />
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
