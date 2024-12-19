import React from 'react';
import AuthService from '../services/auth.service';
import { Container, Grid, Card, CardContent, Typography, Button, Breadcrumbs, Link as MuiLink } from '@mui/material';

const TestProfile = () => {
	const currentUser = AuthService.getCurrentUser();

	return (
		<Container>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Breadcrumbs aria-label="breadcrumb">
						<MuiLink color="inherit" href="/home">
							Home
						</MuiLink>
						<MuiLink color="inherit" href="#/profile">
							User
						</MuiLink>
						<Typography color="textPrimary">User Profile</Typography>
					</Breadcrumbs>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Grid container direction="column" alignItems="center">
								<img
									src="https://bootdey.com/img/Content/avatar/avatar7.png"
									alt="Admin"
									className="rounded-circle"
									width="150"
								/>
								<Typography variant="h4" gutterBottom>
									{currentUser.username}
								</Typography>
								<Typography variant="body1" color="textSecondary">
									Full Stack Developer
								</Typography>
								<Typography variant="body2" color="textSecondary">
									{currentUser.city}, {currentUser.country}
								</Typography>
								<Button variant="contained" color="primary">
									Follow
								</Button>
								<Button variant="outlined" color="primary">
									Message
								</Button>
							</Grid>
						</CardContent>
					</Card>
					<Card style={{ marginTop: '16px' }}>
						<CardContent>
							<Typography variant="h6">Website</Typography>
							<Typography variant="body2" color="textSecondary">
								https://BoC.com
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} md={8}>
					<Card>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={3}>
									<Typography variant="body1">Full Name</Typography>
								</Grid>
								<Grid item xs={9}>
									<Typography variant="body2" color="textSecondary">
										{currentUser.firstName} {currentUser.lastName}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body1">Email</Typography>
								</Grid>
								<Grid item xs={9}>
									<Typography variant="body2" color="textSecondary">
										{currentUser.email}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body1">Phone</Typography>
								</Grid>
								<Grid item xs={9}>
									<Typography variant="body2" color="textSecondary">
										{currentUser.phone}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body1">Team Name</Typography>
								</Grid>
								<Grid item xs={9}>
									<Typography variant="body2" color="textSecondary">
										--
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body1">Address</Typography>
								</Grid>
								<Grid item xs={9}>
									<Typography variant="body2" color="textSecondary">
										{currentUser.city}, {currentUser.country}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Button variant="contained" color="info" href="/testprofile">
										Edit
									</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default TestProfile;
