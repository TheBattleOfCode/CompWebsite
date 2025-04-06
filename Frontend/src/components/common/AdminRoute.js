import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectCurrentUser, selectIsAdmin } from '../../features/auth/authSlice';

/**
 * AdminRoute component for protecting routes that should only be accessible by admins
 * Redirects non-admin users to the home page
 */
const AdminRoute = ({ component: Component, ...rest }) => {
	const currentUser = useSelector(selectCurrentUser);
	const isAdmin = useSelector(selectIsAdmin);

	return (
		<Route
			{...rest}
			render={(props) =>
				currentUser && isAdmin ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: currentUser ? '/home' : '/login',
							state: {
								from: props.location,
								message: 'You need admin privileges to access this page',
							},
						}}
					/>
				)
			}
		/>
	);
};

AdminRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
	// We're intentionally not validating location prop as it comes from react-router
};

export default AdminRoute;
