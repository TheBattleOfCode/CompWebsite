import { apiSlice } from '../apiSlice';

export const problemsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProblems: builder.query({
			query: () => '/problem/getall',
			providesTags: ['Problems'],
		}),
		getProblem: builder.query({
			query: (id) => `/problem/getone/${id}`,
			providesTags: (result, error, id) => [{ type: 'Problems', id }],
		}),
		createProblem: builder.mutation({
			query: (problemData) => {
				const { title, description, score, type } = problemData;
				let body = {
					title,
					description,
					score,
					type,
				};

				// Add type-specific data
				if (type === 'gen' && problemData.file) {
					body.inOutContentGen = problemData.file;
				} else if (type === 'NumberGen') {
					body.min = problemData.min;
					body.max = problemData.max;
					body.answer = problemData.answer;
				} else if (type === 'Qna') {
					body.answer = problemData.answer;
				}

				return {
					url: '/problem/add',
					method: 'POST',
					body,
				};
			},
			invalidatesTags: ['Problems'],
		}),
		deleteProblem: builder.mutation({
			query: (id) => ({
				url: `/problem/delete/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Problems'],
		}),
		// Generated Problem endpoints
		saveGeneratedProblem: builder.mutation({
			query: ({ genInput, genOutput, userId, problemId }) => ({
				url: '/generatedInOut/add',
				method: 'POST',
				body: {
					genInput,
					genOutput,
					userId,
					problemId,
				},
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'GeneratedProblems', id: `${arg.userId}-${arg.problemId}` },
			],
		}),
		getUserProblem: builder.query({
			query: ({ userId, problemId }) => `/generatedInOut/getOne/${userId}/${problemId}`,
			providesTags: (result, error, arg) => [{ type: 'GeneratedProblems', id: `${arg.userId}-${arg.problemId}` }],
		}),
		getProblemStats: builder.query({
			query: (problemId) => `/generatedInOut/getAllByProb/${problemId}`,
			providesTags: (result, error, id) => [{ type: 'Problems', id }],
		}),
		submitAnswer: builder.mutation({
			query: ({ userId, problemId, answer }) => ({
				url: `/generatedInOut/UpdateOne/${userId}/${problemId}/${answer}`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'GeneratedProblems', id: `${arg.userId}-${arg.problemId}` },
				'Standings',
			],
		}),
	}),
});

export const {
	useGetProblemsQuery,
	useGetProblemQuery,
	useCreateProblemMutation,
	useDeleteProblemMutation,
	useSaveGeneratedProblemMutation,
	useGetUserProblemQuery,
	useGetProblemStatsQuery,
	useSubmitAnswerMutation,
} = problemsApiSlice;
