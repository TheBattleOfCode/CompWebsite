import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectCurrentUser, selectIsAdmin } from '../../features/auth/authSlice';

/**
 * AdminRoute component for protecting routes that should only be accessible by admins
 * Redirects non-admin users to the home page
 */
const AdminRoute = ({ children }) => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = useSelector(selectIsAdmin);
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

    if (!isAdmin) {
        // Redirect to home page if not admin
        return (
            <Navigate
                to="/home"
                state={{
                    from: location,
                    message: 'You need admin privileges to access this page',
                }}
                replace
            />
        );
    }

    return children;
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminRoute;
