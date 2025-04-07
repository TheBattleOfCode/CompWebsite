// Mock auth service
const authService = {
	login: jest.fn(),
	register: jest.fn(),
	logout: jest.fn(),
	getCurrentUser: jest.fn(),
};

export default authService;
