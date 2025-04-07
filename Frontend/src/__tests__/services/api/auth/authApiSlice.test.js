import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { authApiSlice } from '../../../../services/api/auth/authApiSlice';

// Setup MSW server
const server = setupServer(
    // Mock login endpoint
    rest.post('http://localhost:8080/api/auth/signin', (req, res, ctx) => {
        const { username, password } = req.body;

        if (username === 'testuser' && password === 'password123') {
            return res(
                ctx.json({
                    id: '123',
                    username: 'testuser',
                    email: 'test@example.com',
                    roles: ['ROLE_USER'],
                    accessToken: 'mock-token',
                })
            );
        }

        return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
    }),

    // Mock register endpoint
    rest.post('http://localhost:8080/api/auth/signup', (req, res, ctx) => {
        const { username } = req.body;

        if (username === 'existinguser') {
            return res(ctx.status(400), ctx.json({ message: 'Username is already taken' }));
        }

        return res(ctx.json({ message: 'User registered successfully!' }));
    })
);

// Setup store with the authApiSlice
const setupApiStore = () => {
    const store = configureStore({
        reducer: {
            [authApiSlice.reducerPath]: authApiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApiSlice.middleware),
    });

    setupListeners(store.dispatch);

    return store;
};

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

describe('authApiSlice', () => {
    let store;

    beforeEach(() => {
        store = setupApiStore();
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('login mutation', () => {
        it('should handle successful login', async () => {
            // Arrange
            const credentials = { username: 'testuser', password: 'password123' };

            // Act
            const result = await store.dispatch(authApiSlice.endpoints.login.initiate(credentials));

            // Assert
            expect(result.data).toEqual({
                id: '123',
                username: 'testuser',
                email: 'test@example.com',
                roles: ['ROLE_USER'],
                accessToken: 'mock-token',
            });
            expect(result.error).toBeUndefined();
        });

        it('should handle login failure', async () => {
            // Arrange
            const credentials = { username: 'testuser', password: 'wrongpassword' };

            // Act
            const result = await store.dispatch(authApiSlice.endpoints.login.initiate(credentials));

            // Assert
            expect(result.data).toBeUndefined();
            expect(result.error.status).toBe(401);
            expect(result.error.data.message).toBe('Invalid credentials');
        });
    });

    describe('register mutation', () => {
        it('should handle successful registration', async () => {
            // Arrange
            const userData = {
                username: 'newuser',
                email: 'new@example.com',
                password: 'password123',
            };

            // Act
            const result = await store.dispatch(authApiSlice.endpoints.register.initiate(userData));

            // Assert
            expect(result.data).toEqual({ message: 'User registered successfully!' });
            expect(result.error).toBeUndefined();
        });

        it('should handle registration failure', async () => {
            // Arrange
            const userData = {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password123',
            };

            // Act
            const result = await store.dispatch(authApiSlice.endpoints.register.initiate(userData));

            // Assert
            expect(result.data).toBeUndefined();
            expect(result.error.status).toBe(400);
            expect(result.error.data.message).toBe('Username is already taken');
        });
    });
});
