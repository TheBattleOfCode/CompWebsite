import React, { useState, useRef } from 'react';
import { TextField, Button, Container, Card, Alert, CircularProgress } from '@mui/material';
import Form from 'react-validation/build/form';
import CheckButton from 'react-validation/build/button';
import AuthService from '../services/auth.service';

const required = (value) => {
	if (!value) {
		return <Alert severity="error">This field is required!</Alert>;
	}
};

const Login = (props) => {
	const form = useRef();
	const checkBtn = useRef();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const onChangeUsername = (e) => {
		const username = e.target.value;
		setUsername(username);
	};

	const onChangePassword = (e) => {
		const password = e.target.value;
		setPassword(password);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		setMessage('');
		setLoading(true);
		form.current.validateAll();

		if (checkBtn.current.context._errors.length === 0) {
			AuthService.login(username, password).then(
				() => {
					props.history.push('/home');
					window.location.reload();
				},
				(error) => {
					const resMessage =
						(error.response && error.response.data && error.response.data.message) ||
						error.message ||
						error.toString();
					setLoading(false);
					setMessage(resMessage);
				},
			);
		} else {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm">
			<Card variant="outlined" sx={{ padding: 2, marginTop: 2 }}>
				<Form onSubmit={handleLogin} ref={form}>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						margin="normal"
						value={username}
						onChange={onChangeUsername}
						validations={[required]}
					/>
					<TextField
						label="Password"
						type="password"
						variant="outlined"
						fullWidth
						margin="normal"
						value={password}
						onChange={onChangePassword}
						validations={[required]}
					/>
					<Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
						{loading && <CircularProgress size={24} />}
						Login
					</Button>
					{message && (
						<Alert severity="error" sx={{ marginTop: 2 }}>
							{message}
						</Alert>
					)}
					<CheckButton style={{ display: 'none' }} ref={checkBtn} />
				</Form>
			</Card>
		</Container>
	);
};

export default Login;
