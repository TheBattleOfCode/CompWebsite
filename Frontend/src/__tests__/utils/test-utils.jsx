import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Import your reducers
import authReducer from '../../features/auth/authSlice';
import { apiSlice } from '../../services/api/apiSlice';
import { countriesApiSlice } from '../../services/api/countries/countriesApiSlice';

// Create a theme instance for testing
const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#9c27b0',
		},
		success: {
			main: '#66bb6a',
		},
		default: {
			main: grey[300],
			dark: grey[400],
		},
	},
	typography: {
		useNextVariants: true,
	},
});

/**
 * Custom render function that includes providers needed for testing
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional options for render
 * @returns {Object} The render result
 */
const customRender = (ui, options = {}) => {
	const {
		route = '/',
		// eslint-disable-next-line no-unused-vars
		_history = {},
		initialState = {},
		store = configureStore({
			reducer: {
				auth: authReducer,
				[apiSlice.reducerPath]: apiSlice.reducer,
				[countriesApiSlice.reducerPath]: countriesApiSlice.reducer,
			},
			middleware: (getDefaultMiddleware) =>
				getDefaultMiddleware().concat(apiSlice.middleware).concat(countriesApiSlice.middleware),
			preloadedState: initialState,
		}),
		...renderOptions
	} = options;

	 
	const Wrapper = ({ children }) => {
		return (
			<Provider store={store}>
				<MemoryRouter initialEntries={[route]}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						{children}
					</ThemeProvider>
				</MemoryRouter>
			</Provider>
		);
	};

	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock AuthService
const mockAuthService = {
	login: vi.fn(),
	logout: vi.fn(),
	register: vi.fn(),
	getCurrentUser: vi.fn(),
};

// Mock localStorage for testing
const mockLocalStorage = (() => {
	let store = {};
	return {
		getItem: vi.fn((key) => store[key] || null),
		setItem: vi.fn((key, value) => {
			store[key] = value.toString();
		}),
		removeItem: vi.fn((key) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
		_getStore: () => store,
		_reset: () => {
			store = {};
		},
	};
})();

// Mock functions
export const mockNavigate = vi.fn();
export const mockUseNavigate = vi.fn(() => mockNavigate);

// Export our custom render and mocks
export { customRender as render, mockAuthService, mockLocalStorage };
