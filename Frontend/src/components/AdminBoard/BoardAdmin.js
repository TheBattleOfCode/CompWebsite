import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import UserService from '../../services/user.service';
import EventBus from '../../common/EventBus';
import Sidebar from './sidebar/Sidebar';
import Dashboard from './Dashboard';

const BoardAdmin = () => {
	const [content, setContent] = useState('');

	useEffect(() => {
		UserService.getAdminBoard().then(
			(response) => {
				setContent(response.data);
			},
			(error) => {
				const _content =
					(error.response && error.response.data && error.response.data.message) ||
					error.message ||
					error.toString();

				setContent(_content);

				if (error.response && error.response.status === 401) {
					EventBus.dispatch('logout');
				}
			},
		);
	}, []);

	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={12} md={3}>
					<Sidebar />
				</Grid>
				<Grid item xs={12} md={9}>
					<Dashboard />
				</Grid>
			</Grid>
		</Container>
	);
};

export default BoardAdmin;
