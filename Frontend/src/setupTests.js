// Vitest setup file
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the window.matchMedia function which is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock localStorage
const localStorageMock = (function () {
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
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

// Suppress React 18 console errors/warnings
const originalConsoleError = console.error;
console.error = (...args) => {
	if (
		/Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
		/Warning: The current testing environment is not configured to support act/.test(args[0])
	) {
		return;
	}
	originalConsoleError(...args);
};

// Mock ResizeObserver which is not implemented in JSDOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock IntersectionObserver which is not implemented in JSDOM
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Setup for testing async operations
global.setImmediate = vi.fn().mockImplementation(setTimeout);
