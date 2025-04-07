import { apiSlice } from '../apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicContent: builder.query({
            query: () => '/test/all',
        }),
        getUserBoard: builder.query({
            query: () => '/test/user',
        }),
        getModeratorBoard: builder.query({
            query: () => '/test/mod',
        }),
        getAdminBoard: builder.query({
            query: () => '/test/admin',
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/test/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
        }),
        getUsers: builder.query({
            query: () => '/test/getUsers',
            providesTags: ['User'],
        }),
        getStandings: builder.query({
            query: () => '/standings',
            providesTags: ['Standings'],
        }),
    }),
});

export const {
    useGetPublicContentQuery,
    useGetUserBoardQuery,
    useGetModeratorBoardQuery,
    useGetAdminBoardQuery,
    useUpdateUserMutation,
    useGetUsersQuery,
    useGetStandingsQuery,
} = usersApiSlice;
