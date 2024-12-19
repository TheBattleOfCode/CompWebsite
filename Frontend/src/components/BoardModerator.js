import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';
import UserService from '../services/user.service';
import EventBus from '../common/EventBus';

const BoardModerator = () => {
	const [content, setContent] = useState('');

	useEffect(() => {
		UserService.getModeratorBoard().then(
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
			<Card>
				<CardContent>
					<Typography variant="h3">{content}</Typography>
				</CardContent>
			</Card>
		</Container>
	);
};

export default BoardModerator;
