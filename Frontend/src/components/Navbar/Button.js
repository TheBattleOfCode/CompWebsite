import React from 'react';
import { Link } from 'react-router-dom';
import { Button as MuiButton } from '@mui/material';
import './Button.css';

function Button() {
	return (
		<Link to="signup">
			<MuiButton variant="contained" color="primary">
				Sign Up
			</MuiButton>
		</Link>
	);
}

export default Button;
