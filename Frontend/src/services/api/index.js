// Export all API slices and hooks from a single file
import { apiSlice, getCurrentUser } from './apiSlice';
import { authApiSlice, useLoginMutation, useRegisterMutation } from './auth/authApiSlice';
import { countriesApiSlice, useGetCountriesQuery } from './countries/countriesApiSlice';
import {
	problemsApiSlice,
	useGetProblemsQuery,
	useGetProblemQuery,
	useCreateProblemMutation,
	useDeleteProblemMutation,
	useSaveGeneratedProblemMutation,
	useGetUserProblemQuery,
	useGetProblemStatsQuery,
	useSubmitAnswerMutation,
} from './problems/problemsApiSlice';
import {
	usersApiSlice,
	useGetPublicContentQuery,
	useGetUserBoardQuery,
	useGetModeratorBoardQuery,
	useGetAdminBoardQuery,
	useUpdateUserMutation,
	useGetUsersQuery,
	useGetStandingsQuery,
} from './users/usersApiSlice';

// Export all API slices
export { apiSlice, authApiSlice, problemsApiSlice, usersApiSlice, countriesApiSlice };

// Export all hooks
export {
	// Auth hooks
	useLoginMutation,
	useRegisterMutation,

	// Problem hooks
	useGetProblemsQuery,
	useGetProblemQuery,
	useCreateProblemMutation,
	useDeleteProblemMutation,

	// Generated Problem hooks
	useSaveGeneratedProblemMutation,
	useGetUserProblemQuery,
	useGetProblemStatsQuery,
	useSubmitAnswerMutation,

	// User hooks
	useGetPublicContentQuery,
	useGetUserBoardQuery,
	useGetModeratorBoardQuery,
	useGetAdminBoardQuery,
	useUpdateUserMutation,
	useGetUsersQuery,

	// Countries hooks
	useGetCountriesQuery,

	// Standings hooks
	useGetStandingsQuery,

	// Helper functions
	getCurrentUser,
};
