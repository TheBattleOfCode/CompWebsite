import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';

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
    history = {},
    initialState = {},
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock AuthService
const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  getCurrentUser: jest.fn(),
};

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    _getStore: () => store,
    _reset: () => {
      store = {};
    },
  };
})();

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render, mockAuthService, mockLocalStorage };
