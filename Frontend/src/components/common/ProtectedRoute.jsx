import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectCurrentUser } from '../../features/auth/authSlice';

/**
 * ProtectedRoute component for protecting routes that require authentication
 * Redirects unauthenticated users to the login page
 */
const ProtectedRoute = ({ children }) => {
	const currentUser = useSelector(selectCurrentUser);
	const location = useLocation();

	if (!currentUser) {
		// Redirect to login page with the return url
		return (
			<Navigate
				to="/login"
				state={{
					from: location,
					message: 'You need to be logged in to access this page',
				}}
				replace
			/>
		);
	}

	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
