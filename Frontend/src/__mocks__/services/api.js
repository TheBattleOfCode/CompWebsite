// Mock API service
export const useLoginMutation = jest.fn();
export const useRegisterMutation = jest.fn();
export const useGetProblemsQuery = jest.fn();
export const useGetProblemQuery = jest.fn();
export const useCreateProblemMutation = jest.fn();
export const useDeleteProblemMutation = jest.fn();
export const useSaveGeneratedProblemMutation = jest.fn();
export const useGetUserProblemQuery = jest.fn();
export const useGetProblemStatsQuery = jest.fn();
export const useSubmitAnswerMutation = jest.fn();
export const useGetPublicContentQuery = jest.fn();
export const useGetUserBoardQuery = jest.fn();
export const useGetModeratorBoardQuery = jest.fn();
export const useGetAdminBoardQuery = jest.fn();
export const useUpdateUserMutation = jest.fn();
export const useGetUsersQuery = jest.fn();
export const useGetCountriesQuery = jest.fn();
export const useGetStandingsQuery = jest.fn();

export const getCurrentUser = jest.fn();

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
