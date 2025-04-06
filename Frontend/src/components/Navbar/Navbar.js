import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CodeIcon from '@mui/icons-material/Code';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { selectCurrentUser, selectIsAdmin, logout } from '../../features/auth/authSlice';

// Define navigation items
const publicPages = [
	{ screenName: 'Problems', link: '/home' },
	{ screenName: 'Standings', link: '/standings' },
];

const adminPages = [{ screenName: 'Create Problem', link: '/createProb', adminOnly: true }];

function Navbar({ themeMode, toggleThemeMode }) {
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();

	// Get user data from Redux
	const currentUser = useSelector(selectCurrentUser);
	const isAdmin = useSelector(selectIsAdmin);

	// Combine pages based on user role
	const availablePages = [...publicPages, ...(isAdmin ? adminPages : [])];

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleUserMenuAction = (setting) => {
		handleCloseUserMenu();

		if (setting === 'Profile') {
			history.push('/profile');
		} else if (setting === 'Logout') {
			dispatch(logout());
			history.push('/login');
		}
	};

	const handleNavigation = (link) => {
		history.push(link);
		handleCloseNavMenu();
	};

	// Check if a nav item is active
	const isActive = (path) => {
		if (path === '/home' && (location.pathname === '/' || location.pathname === '/home')) {
			return true;
		}
		return location.pathname === path;
	};

	return (
		<AppBar position="static" elevation={3} sx={{ mb: 3 }}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					{/* Logo - Desktop */}
					<CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component="a"
						onClick={() => history.push('/')}
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.1rem',
							color: 'inherit',
							textDecoration: 'none',
							cursor: 'pointer',
						}}
					>
						Battle of Code
					</Typography>

					{/* Mobile Menu */}
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="menu"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							keepMounted
							transformOrigin={{ vertical: 'top', horizontal: 'left' }}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: 'block', md: 'none' } }}
						>
							{currentUser &&
								availablePages.map(({ screenName, link }) => (
									<MenuItem
										key={screenName}
										onClick={() => handleNavigation(link)}
										selected={isActive(link)}
									>
										<Typography textAlign="center">{screenName}</Typography>
									</MenuItem>
								))}
							{!currentUser && (
								<>
									<MenuItem onClick={() => handleNavigation('/login')}>
										<Typography textAlign="center">Login</Typography>
									</MenuItem>
									<MenuItem onClick={() => handleNavigation('/register')}>
										<Typography textAlign="center">Register</Typography>
									</MenuItem>
								</>
							)}
							<MenuItem onClick={toggleThemeMode}>
								<Typography textAlign="center" sx={{ display: 'flex', alignItems: 'center' }}>
									{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
									{themeMode === 'dark' ? (
										<Brightness7Icon sx={{ ml: 1 }} />
									) : (
										<Brightness4Icon sx={{ ml: 1 }} />
									)}
								</Typography>
							</MenuItem>
						</Menu>
					</Box>

					{/* Logo - Mobile */}
					<CodeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						onClick={() => history.push('/')}
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.1rem',
							color: 'inherit',
							textDecoration: 'none',
							cursor: 'pointer',
						}}
					>
						BoC
					</Typography>

					{/* Desktop Menu */}
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{currentUser &&
							availablePages.map(({ screenName, link, adminOnly }) => (
								<Button
									key={screenName}
									onClick={() => handleNavigation(link)}
									sx={{
										my: 2,
										color: 'white',
										display: 'flex',
										alignItems: 'center',
										backgroundColor: isActive(link) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
										'&:hover': {
											backgroundColor: isActive(link)
												? 'rgba(255, 255, 255, 0.2)'
												: 'rgba(255, 255, 255, 0.1)',
										},
										mx: 0.5,
										px: 2,
									}}
									startIcon={adminOnly ? <AdminPanelSettingsIcon /> : null}
								>
									{screenName}
								</Button>
							))}
						{!currentUser && (
							<>
								<Button
									onClick={() => handleNavigation('/login')}
									sx={{
										my: 2,
										color: 'white',
										display: 'block',
										backgroundColor: isActive('/login')
											? 'rgba(255, 255, 255, 0.1)'
											: 'transparent',
										mx: 0.5,
										px: 2,
									}}
								>
									Login
								</Button>
								<Button
									onClick={() => handleNavigation('/register')}
									sx={{
										my: 2,
										color: 'white',
										display: 'block',
										backgroundColor: isActive('/register')
											? 'rgba(255, 255, 255, 0.1)'
											: 'transparent',
										mx: 0.5,
										px: 2,
									}}
								>
									Register
								</Button>
							</>
						)}
					</Box>

					{/* Theme Toggle */}
					<Box sx={{ mr: 2 }}>
						<Tooltip title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}>
							<IconButton onClick={toggleThemeMode} color="inherit">
								{themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
							</IconButton>
						</Tooltip>
					</Box>

					{/* User Menu */}
					{currentUser && (
						<Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
							{isAdmin && (
								<Tooltip title="Admin">
									<AdminPanelSettingsIcon sx={{ mr: 1, color: 'secondary.main' }} />
								</Tooltip>
							)}
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar
										alt={currentUser.username}
										src={currentUser.profilePicture || '/static/images/avatar/2.jpg'}
										sx={{
											bgcolor: 'secondary.main',
											width: 40,
											height: 40,
											border: '2px solid',
											borderColor: 'background.paper',
										}}
									>
										{currentUser.username.charAt(0).toUpperCase()}
									</Avatar>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								keepMounted
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem onClick={() => handleUserMenuAction('Profile')}>
									<Typography textAlign="center">Profile</Typography>
								</MenuItem>
								<MenuItem onClick={() => handleUserMenuAction('Logout')}>
									<Typography textAlign="center">Logout</Typography>
								</MenuItem>
							</Menu>
						</Box>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}

Navbar.propTypes = {
	themeMode: PropTypes.oneOf(['light', 'dark']).isRequired,
	toggleThemeMode: PropTypes.func.isRequired,
};

export default Navbar;
