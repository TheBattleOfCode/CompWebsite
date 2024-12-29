import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AuthService from '../../services/auth.service';
import EventBus from '../../common/EventBus';

function Navbar() {
	const [anchorEl, setAnchorEl] = useState(null);
	const [showModeratorBoard, setShowModeratorBoard] = useState(false);
	const [showAdminBoard, setShowAdminBoard] = useState(false);
	const [currentUser, setCurrentUser] = useState(undefined);
	const [actives, setActives] = useState('home');

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

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
					Battle Of Code
				</Typography>
				<div className="nav-items">
					<Button component={Link} to="/home" color="inherit" onClick={() => setActives('home')}>
						Home
					</Button>
					{showAdminBoard && (
						<>
							<Button
								component={Link}
								to="/createProb"
								color="inherit"
								onClick={() => setActives('createproblem')}
							>
								Create Problem
							</Button>
						</>
					)}
					<Button component={Link} to="/standings" color="inherit" onClick={() => setActives('standings')}>
						Standings
					</Button>
				</div>
				{currentUser ? (
					<div className="nav-last">
						<IconButton
							edge="end"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem component={Link} to="/profile" onClick={handleClose}>
								{currentUser.username}
							</MenuItem>
							<MenuItem
								component={Link}
								to="/login"
								onClick={() => {
									logOut();
									handleClose();
								}}
							>
								Logout
							</MenuItem>
						</Menu>
					</div>
				) : (
					<div className="nav-last">
						<Button component={Link} to="/login" color="inherit">
							Login
						</Button>
						<Button component={Link} to="/register" color="inherit">
							Sign up
						</Button>
					</div>
				)}
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
