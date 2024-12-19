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
import BoardUser from './components/BoardUser';
import BoardModerator from './components/BoardModerator';
import BoardAdmin from './components/AdminBoard/BoardAdmin';
import CreateProblem from './components/CreateProblem';
import ProbNumberGen from './components/ProbNumberGen';
import Contest from './components/Contest';
import Standings from './components/Standings';
import TestProfile from './components/testProfile';
import Navbar from './components/Navbar/Navbar';

import EventBus from './common/EventBus';

const App = () => {
	const [showModeratorBoard, setShowModeratorBoard] = useState(false);
	const [showAdminBoard, setShowAdminBoard] = useState(false);
	const [currentUser, setCurrentUser] = useState(undefined);

	const theme = createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#e65100',
			},
			secondary: {
				main: '#f50057',
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
			<Navbar />
			<Container>
				<Switch>
					<Route exact path={['/', '/home']} component={Home} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/profile" component={Profile} />
					<Route path="/user" component={BoardUser} />
					<Route path="/mod" component={BoardModerator} />
					<Route path="/admin" component={BoardAdmin} />
					<Route exact path="/contest" component={Contest} />
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
