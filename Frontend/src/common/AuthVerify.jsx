import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
const AuthVerify = ({ logOut }) => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));

		if (user) {
			const decodedJwt = parseJwt(user.accessToken);

			// If token is expired, log out the user
			if (decodedJwt.exp * 1000 < Date.now()) {
				logOut();
				navigate('/login');
			}
		}
	}, [location, logOut, navigate]);

	return <div></div>;
};

AuthVerify.propTypes = {
	logOut: PropTypes.func.isRequired,
};

export default AuthVerify;
