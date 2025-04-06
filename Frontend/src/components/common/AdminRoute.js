import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AdminRoute component for protecting routes that should only be accessible by admins
 * Redirects non-admin users to the home page
 */
const AdminRoute = ({ component: Component, currentUser, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			currentUser && currentUser.roles.includes('ROLE_ADMIN') ? (
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

AdminRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
	currentUser: PropTypes.object,
	// We're intentionally not validating location prop as it comes from react-router
};

export default AdminRoute;
