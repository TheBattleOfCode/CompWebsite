import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { render, mockAuthService } from '../../utils/test-utils';
import Login from './index';
import AuthService from '../../services/auth.service';

// Mock the auth service
jest.mock('../../services/auth.service', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    // Arrange & Act
    render(<Login {...mockProps} />);
    
    // Assert
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });

  it('redirects to home if user is already logged in', () => {
    // Arrange
    AuthService.getCurrentUser.mockReturnValueOnce({
      username: 'testuser',
      roles: ['ROLE_USER'],
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
    AuthService.login.mockResolvedValueOnce({});
    render(<Login {...mockProps} />);
    
    // Act
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    expect(AuthService.login).toHaveBeenCalledWith('testuser', 'password123');
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error message on login failure', async () => {
    // Arrange
    const errorMessage = 'Invalid credentials';
    AuthService.login.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    render(<Login {...mockProps} />);
    
    // Act
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });

  it('redirects to the page the user was trying to access after login', async () => {
    // Arrange
    AuthService.login.mockResolvedValueOnce({});
    
    // Override the useLocation mock for this test
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: { from: { pathname: '/profile' } },
    });
    
    render(<Login {...mockProps} />);
    
    // Act
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/profile');
    });
  });
});
