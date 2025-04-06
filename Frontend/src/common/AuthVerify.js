import React from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Parse the JWT token to get the expiration date
 *
 * @param {string} token
 * @return {object}
 */
const parseJwt = (token) => {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch (e) {
		return null;
	}
};

/**
 * Verify if the user is logged in
 *
 * @param {object} props
 * @return {object} React component
 */
// We're not validating history and logOut props as they come from react-router and parent component
// eslint-disable-next-line react/prop-types
const AuthVerify = (props) => {
	props.history.listen(() => {
		const user = JSON.parse(localStorage.getItem('user'));

		if (user) {
			const decodedJwt = parseJwt(user.accessToken);

			if (decodedJwt.exp * 1000 < Date.now()) {
				// eslint-disable-next-line react/prop-types
				props.logOut();
			}
		}
	});

	return <div></div>;
};

export default withRouter(AuthVerify);
