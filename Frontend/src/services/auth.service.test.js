import axios from 'axios';
import AuthService from './auth.service';

// Mock axios
jest.mock('axios');

describe('AuthService', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should call axios.post with the correct parameters', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'password123';
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          roles: ['ROLE_USER'],
          accessToken: 'mock-token',
        },
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await AuthService.login(username, password);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signin'),
        { username, password }
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockResponse.data)
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'wrongpassword';
      const mockError = new Error('Invalid credentials');
      axios.post.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(AuthService.login(username, password)).rejects.toThrow('Invalid credentials');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage', () => {
      // Arrange
      localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

      // Act
      AuthService.logout();

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('register', () => {
    it('should call axios.post with the correct parameters', async () => {
      // Arrange
      const username = 'newuser';
      const email = 'new@example.com';
      const password = 'password123';
      const mockResponse = {
        data: { message: 'User registered successfully!' },
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await AuthService.register(username, email, password);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signup'),
        { username, email, password }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration error', async () => {
      // Arrange
      const username = 'existinguser';
      const email = 'existing@example.com';
      const password = 'password123';
      const mockError = new Error('Username is already taken');
      axios.post.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(AuthService.register(username, email, password)).rejects.toThrow(
        'Username is already taken'
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
      // Arrange
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['ROLE_USER'],
        accessToken: 'mock-token',
      };
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

      // Act
      const result = AuthService.getCurrentUser();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user in localStorage', () => {
      // Arrange
      localStorage.getItem.mockReturnValueOnce(null);

      // Act
      const result = AuthService.getCurrentUser();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith('user');
      expect(result).toBeNull();
    });

    it('should handle invalid JSON in localStorage', () => {
      // Arrange
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(JSON, 'parse').mockImplementation(() => null);
      localStorage.getItem.mockReturnValueOnce('invalid-json');

      // Act
      const result = AuthService.getCurrentUser();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith('user');
      expect(result).toBeNull();

      // Restore mocks
      console.error.mockRestore();
      JSON.parse.mockRestore();
    });
  });
});
