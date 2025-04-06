import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import authHeader from '../auth-header';

// Define our base API URL
// eslint-disable-next-line no-undef
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create our base API slice
export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL,
		prepareHeaders: (headers) => {
			// Get the auth header and add it to our requests
			const authHeaderValue = authHeader();
			Object.keys(authHeaderValue).forEach((key) => {
				headers.set(key, authHeaderValue[key]);
			});
			return headers;
		},
	}),
	tagTypes: ['Problems', 'UserProblems', 'User', 'Standings', 'GeneratedProblems', 'Auth'],
	endpoints: () => ({}),
});

// Helper function to get current user from localStorage
export const getCurrentUser = () => {
	try {
		return JSON.parse(localStorage.getItem('user'));
	} catch (error) {
		console.error('Error parsing user from localStorage:', error);
		return null;
	}
};
