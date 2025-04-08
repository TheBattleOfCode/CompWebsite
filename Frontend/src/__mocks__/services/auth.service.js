import { vi } from 'vitest';

// Mock auth service
const authService = {
	login: vi.fn(),
	register: vi.fn(),
	logout: vi.fn(),
	getCurrentUser: vi.fn(),
};

export default authService;
