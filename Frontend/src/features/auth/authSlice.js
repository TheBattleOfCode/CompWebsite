import { createSlice } from '@reduxjs/toolkit';

import { authApiSlice, getCurrentUser } from '../../services/api';

// Get user from localStorage
const user = getCurrentUser();

const initialState = {
    user: user || null,
    isAdmin: user ? user.roles.includes('ROLE_ADMIN') : false,
    isModerator: user ? user.roles.includes('ROLE_MODERATOR') : false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('user');
            state.user = null;
            state.isAdmin = false;
            state.isModerator = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, { payload }) => {
                localStorage.setItem('user', JSON.stringify(payload));
                state.user = payload;
                state.isAdmin = payload.roles.includes('ROLE_ADMIN');
                state.isModerator = payload.roles.includes('ROLE_MODERATOR');
            })
            .addMatcher(authApiSlice.endpoints.register.matchFulfilled, () => {
                // We don't automatically log in after registration
                // Just leave the state as is
            });
    },
});

export const { logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectIsModerator = (state) => state.auth.isModerator;

export default authSlice.reducer;
