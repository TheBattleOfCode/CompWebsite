import React, { useState, useRef } from 'react';
import { TextField, Button, Container, Card, Alert } from '@mui/material';
import Form from 'react-validation/build/form';
import CheckButton from 'react-validation/build/button';
import { isEmail } from 'validator';
import AuthService from '../services/auth.service';

const required = (value) => {
	if (!value) {
		return <Alert severity="error">This field is required!</Alert>;
	}
};

const validEmail = (value) => {
	if (!isEmail(value)) {
		return <Alert severity="error">This is not a valid email.</Alert>;
	}
};

const vusername = (value) => {
	if (value.length < 3 || value.length > 20) {
		return <Alert severity="error">The username must be between 3 and 20 characters.</Alert>;
	}
};

const vpassword = (value) => {
	if (value.length < 6 || value.length > 40) {
		return <Alert severity="error">The password must be between 6 and 40 characters.</Alert>;
	}
};

const Register = (props) => {
	const form = useRef();
	const checkBtn = useRef();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState('');

	const onChangeUsername = (e) => {
		const username = e.target.value;
		setUsername(username.trim().toUpperCase());
	};

	const onChangeEmail = (e) => {
		const email = e.target.value;
		setEmail(email.trim().toLowerCase());
	};

	const onChangePassword = (e) => {
		const password = e.target.value;
		setPassword(password);
	};

	const handleRegister = (e) => {
		e.preventDefault();
		setMessage('');
		setSuccessful(false);
		form.current.validateAll();

		if (checkBtn.current.context._errors.length === 0) {
			AuthService.register(username, email, password).then(
				(response) => {
					setMessage(response.data.message);
					setSuccessful(true);
				},
				(error) => {
					const resMessage =
						(error.response && error.response.data && error.response.data.message) ||
						error.message ||
						error.toString();
					setMessage(resMessage);
					setSuccessful(false);
				},
			);
		}
	};

	return (
		<Container maxWidth="sm">
			<Card variant="outlined" sx={{ padding: 2, marginTop: 2 }}>
				<Form onSubmit={handleRegister} ref={form}>
					{!successful && (
						<div>
							<TextField
								label="Username"
								variant="outlined"
								fullWidth
								margin="normal"
								value={username}
								onChange={onChangeUsername}
								validations={[required, vusername]}
							/>
							<TextField
								label="Email"
								variant="outlined"
								fullWidth
								margin="normal"
								value={email}
								onChange={onChangeEmail}
								validations={[required, validEmail]}
							/>
							<TextField
								label="Password"
								type="password"
								variant="outlined"
								fullWidth
								margin="normal"
								value={password}
								onChange={onChangePassword}
								validations={[required, vpassword]}
							/>
							<Button type="submit" variant="contained" color="primary" fullWidth>
								Sign Up
							</Button>
						</div>
					)}
					{message && (
						<Alert severity={successful ? 'success' : 'error'} sx={{ marginTop: 2 }}>
							{message}
						</Alert>
					)}
					<CheckButton style={{ display: 'none' }} ref={checkBtn} />
				</Form>
			</Card>
		</Container>
	);
};

export default Register;
