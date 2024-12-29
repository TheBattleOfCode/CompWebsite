import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import AuthService from './services/auth.service';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import CreateProblem from './components/CreateProblem';
import ProbNumberGen from './components/ProbNumberGen';
import Standings from './components/Standings';
import TestProfile from './components/testProfile';
import Navbar from './components/Navbar/Navbar';

import EventBus from './common/EventBus';
import Navbar2 from './components/Navbar/Navbar2';

const App = () => {
	const [showModeratorBoard, setShowModeratorBoard] = useState(false);
	const [showAdminBoard, setShowAdminBoard] = useState(false);
	const [currentUser, setCurrentUser] = useState(undefined);

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
	});

	useEffect(() => {
		const user = AuthService.getCurrentUser();

		if (user) {
			setCurrentUser(user);
			setShowModeratorBoard(user.roles.includes('ROLE_MODERATOR'));
			setShowAdminBoard(user.roles.includes('ROLE_ADMIN'));
		}

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
		setCurrentUser(undefined);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{/* <Navbar /> */}
			<Navbar2 />
			<Container>
				<Switch>
					<Route exact path={['/', '/home']} component={Home} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/profile" component={Profile} />
					<Route exact path="/standings" component={Standings} />
					<Route exact path="/createProb" component={CreateProblem} />
					<Route exact path="/ProbNumberGen/:id" component={ProbNumberGen} />
					<Route exact path={'/TestProfile'} component={TestProfile} />
				</Switch>
			</Container>
		</ThemeProvider>
	);
};

export default App;
