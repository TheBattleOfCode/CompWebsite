import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { render } from '../../../__tests__/utils/test-utils';
import Login from '../../../components/Login/Login';
import { useLoginMutation } from '../../../services';
import { selectCurrentUser } from '../../../features/auth/authSlice';

// Mock the services
jest.mock('../../../services', () => ({
    useLoginMutation: jest.fn(),
}));

// Mock the Redux hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

// Mock the react-router-dom's useLocation hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: null,
    }),
}));

describe('Login Component', () => {
    const mockHistoryPush = jest.fn();
    const mockProps = {
        history: {
            push: mockHistoryPush,
        },
    };

    // Mock login mutation
    const mockLoginMutation = jest.fn();
    const mockLoginMutationResult = [mockLoginMutation, { isLoading: false }];

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup useLoginMutation mock
        useLoginMutation.mockReturnValue(mockLoginMutationResult);

        // Setup useSelector mock
        require('react-redux').useSelector.mockImplementation((selector) => {
            if (selector === selectCurrentUser) {
                return null; // No user logged in by default
            }
            return null;
        });

        // Setup useDispatch mock
        require('react-redux').useDispatch.mockReturnValue(jest.fn());
    });

    it('renders login form correctly', () => {
        // Arrange & Act
        render(<Login {...mockProps} />);

        // Assert
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    it('redirects to home if user is already logged in', () => {
        // Arrange
        require('react-redux').useSelector.mockImplementation((selector) => {
            if (selector === selectCurrentUser) {
                return { username: 'testuser', roles: ['ROLE_USER'] };
            }
            return null;
        });

        // Act
        render(<Login {...mockProps} />);

        // Assert
        expect(mockHistoryPush).toHaveBeenCalledWith('/home');
    });

    it('updates form values when user types', () => {
        // Arrange
        render(<Login {...mockProps} />);
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        // Act
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Assert
        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });

    it('calls login service and redirects on successful login', async () => {
        // Arrange
        mockLoginMutation.mockResolvedValueOnce({});
        render(<Login {...mockProps} />);

        // Act
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Assert
        await waitFor(() => {
            expect(mockLoginMutation).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
        });

        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith('/home');
        });
    });

    it('shows error message on login failure', async () => {
        // Arrange
        const errorMessage = 'Invalid credentials';
        mockLoginMutation.mockRejectedValueOnce({
            data: { message: errorMessage },
        });
        render(<Login {...mockProps} />);

        // Act
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Assert
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
        expect(mockHistoryPush).not.toHaveBeenCalled();
    });

    it('redirects to the page the user was trying to access after login', async () => {
        // Arrange
        mockLoginMutation.mockResolvedValueOnce({});

        // Override the useLocation mock for this test
        jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
            state: { from: { pathname: '/profile' } },
        });

        render(<Login {...mockProps} />);

        // Act
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Assert
        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith('/profile');
        });
    });
});
