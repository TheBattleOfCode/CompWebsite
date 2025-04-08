import { vi } from 'vitest';

// Mock API service
export const useLoginMutation = vi.fn();
export const useRegisterMutation = vi.fn();
export const useGetProblemsQuery = vi.fn();
export const useGetProblemQuery = vi.fn();
export const useCreateProblemMutation = vi.fn();
export const useDeleteProblemMutation = vi.fn();
export const useSaveGeneratedProblemMutation = vi.fn();
export const useGetUserProblemQuery = vi.fn();
export const useGetProblemStatsQuery = vi.fn();
export const useSubmitAnswerMutation = vi.fn();
export const useGetPublicContentQuery = vi.fn();
export const useGetUserBoardQuery = vi.fn();
export const useGetModeratorBoardQuery = vi.fn();
export const useGetAdminBoardQuery = vi.fn();
export const useUpdateUserMutation = vi.fn();
export const useGetUsersQuery = vi.fn();
export const useGetCountriesQuery = vi.fn();
export const useGetStandingsQuery = vi.fn();

export const getCurrentUser = vi.fn();

export const apiSlice = {
	endpoints: {
		login: { matchFulfilled: 'login.matchFulfilled' },
		register: { matchFulfilled: 'register.matchFulfilled' },
	},
};

export const authApiSlice = {
	endpoints: {
		login: { matchFulfilled: 'login.matchFulfilled' },
		register: { matchFulfilled: 'register.matchFulfilled' },
	},
};

export const problemsApiSlice = {
	endpoints: {
		getProblems: { matchFulfilled: 'getProblems.matchFulfilled' },
		getProblem: { matchFulfilled: 'getProblem.matchFulfilled' },
	},
};

export const usersApiSlice = {
	endpoints: {
		getUsers: { matchFulfilled: 'getUsers.matchFulfilled' },
	},
};

export const countriesApiSlice = {
	endpoints: {
		getCountries: { matchFulfilled: 'getCountries.matchFulfilled' },
	},
};
