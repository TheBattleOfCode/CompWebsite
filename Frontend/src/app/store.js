import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from '../features/auth/authSlice';
import {
    apiSlice,
    // These slices are imported for completeness but not directly used in this file
    // eslint-disable-next-line no-unused-vars
    authApiSlice,
    // eslint-disable-next-line no-unused-vars
    problemsApiSlice,
    // eslint-disable-next-line no-unused-vars
    usersApiSlice,
    countriesApiSlice,
} from '../services/api';

export const store = configureStore({
    reducer: {
        // API reducers
        [apiSlice.reducerPath]: apiSlice.reducer,
        [countriesApiSlice.reducerPath]: countriesApiSlice.reducer,

        // Feature reducers
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware).concat(countriesApiSlice.middleware),
});

// Required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
