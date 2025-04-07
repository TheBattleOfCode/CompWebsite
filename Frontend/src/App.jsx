import { Container } from '@mui/material';
import { grey, blue, purple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Redux

// Components
import EventBus from './common/EventBus.jsx';
import CreateProblem from './components/CreateProblem/CreateProblem.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import ProblemSolver from './components/ProblemSolver/ProblemSolver.jsx';
import Profile from './components/Profile/Profile.jsx';
import Register from './components/Register/Register.jsx';
import Standings from './components/Standings/Standings.jsx';
import { logout, selectCurrentUser, selectIsAdmin } from './features/auth/authSlice';

// Event bus for global events

// Import PropTypes for validation

// Protected Route component
const ProtectedRoute = ({ children }) => {
	const currentUser = useSelector(selectCurrentUser);
	const location = useLocation();

	if (!currentUser) {
		// Redirect to login page with the return url
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

// Admin Route component
const AdminRoute = ({ children }) => {
	const currentUser = useSelector(selectCurrentUser);
	const isAdmin = useSelector(selectIsAdmin);
	const location = useLocation();

	if (!currentUser) {
		// Redirect to login page with the return url
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (!isAdmin) {
		// Redirect to home page if not admin
		return <Navigate to="/home" replace />;
	}

	return children;
};

AdminRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

function App() {
	const [mode, setMode] = useState(() => {
		// Get saved theme preference from localStorage or default to 'light'
		const savedMode = localStorage.getItem('themeMode');
		return savedMode || 'light';
	});

	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Create theme based on current mode
	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					...(mode === 'light'
						? {
								// Light mode palette
								primary: {
									main: blue[700],
								},
								secondary: {
									main: purple[500],
								},
								background: {
									default: '#f5f5f5',
									paper: '#ffffff',
								},
								text: {
									primary: grey[900],
									secondary: grey[700],
								},
							}
						: {
								// Dark mode palette
								primary: {
									main: blue[300],
								},
								secondary: {
									main: purple[300],
								},
								background: {
									default: '#121212',
									paper: '#1e1e1e',
								},
								text: {
									primary: '#ffffff',
									secondary: grey[400],
								},
							}),
				},
				typography: {
					fontFamily: '"Source Sans Pro", "Roboto", "Helvetica", "Arial", sans-serif',
				},
				components: {
					MuiButton: {
						styleOverrides: {
							root: {
								borderRadius: 8,
							},
						},
					},
					MuiPaper: {
						styleOverrides: {
							root: {
								borderRadius: 8,
							},
						},
					},
				},
			}),
		[mode]
	);

	// Toggle between light and dark mode
	const toggleThemeMode = () => {
		const newMode = mode === 'light' ? 'dark' : 'light';
		setMode(newMode);
		localStorage.setItem('themeMode', newMode);
	};

	useEffect(() => {
		// Simulate loading
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		// Listen for logout events
		EventBus.on('logout', () => {
			dispatch(logout());
			navigate('/login');
		});

		return () => {
			clearTimeout(timer);
			EventBus.remove('logout');
		};
	}, [dispatch, navigate]);

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
			<Navbar themeMode={mode} toggleThemeMode={toggleThemeMode} />
			<Container>
				<Routes>
					{/* Public routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected routes for all authenticated users */}
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/home"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/standings"
						element={
							<ProtectedRoute>
								<Standings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/problem/:id"
						element={
							<ProtectedRoute>
								<ProblemSolver />
							</ProtectedRoute>
						}
					/>

					{/* Admin-only routes */}
					<Route
						path="/createProb"
						element={
							<AdminRoute>
								<CreateProblem />
							</AdminRoute>
						}
					/>

					{/* Fallback route */}
					<Route path="*" element={<Navigate to="/home" replace />} />
				</Routes>
			</Container>
		</ThemeProvider>
	);
}

export default App;
