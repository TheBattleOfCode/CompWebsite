import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AdminRoute from '../../../components/common/AdminRoute';

// Mock component to render when the route matches
const MockAdminComponent = () => <div>Admin Component</div>;

// Create a mock Redux store
const createMockStore = (isAdmin, currentUser) => {
    return configureStore({
        reducer: {
            auth: () => ({
                user: currentUser,
                isAdmin: isAdmin,
            }),
        },
        preloadedState: {
            auth: {
                user: currentUser,
                isAdmin: isAdmin,
            },
        },
    });
};

describe('AdminRoute Component', () => {
    it('renders the component for admin users', () => {
        // Arrange
        const adminUser = {
            username: 'admin',
            roles: ['ROLE_ADMIN'],
        };
        const mockStore = createMockStore(true, adminUser);

        // Act
        render(
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={['/admin']}>
                    <AdminRoute path="/admin" component={MockAdminComponent} />
                </MemoryRouter>
            </Provider>
        );

        // Assert
        expect(screen.getByText('Admin Component')).toBeInTheDocument();
    });

    it('redirects non-admin users to home page', () => {
        // Arrange
        const regularUser = {
            username: 'user',
            roles: ['ROLE_USER'],
        };
        const mockStore = createMockStore(false, regularUser);

        // Act
        render(
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={['/admin']}>
                    <AdminRoute path="/admin" component={MockAdminComponent} />
                    <Route path="/home">
                        <div>Home Page</div>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        // Assert
        expect(screen.queryByText('Admin Component')).not.toBeInTheDocument();
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('redirects unauthenticated users to login page', () => {
        // Arrange
        const mockStore = createMockStore(false, null);

        // Act
        render(
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={['/admin']}>
                    <AdminRoute path="/admin" component={MockAdminComponent} />
                    <Route path="/login">
                        <div>Login Page</div>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        // Assert
        expect(screen.queryByText('Admin Component')).not.toBeInTheDocument();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('passes props to the component', () => {
        // Arrange
        const adminUser = {
            username: 'admin',
            roles: ['ROLE_ADMIN'],
        };
        const mockStore = createMockStore(true, adminUser);

        const TestComponent = (props) => {
            return <div data-testid="test-component">Admin Component with prop: {props.testProp}</div>;
        };

        // Act
        render(
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={['/admin']}>
                    <AdminRoute path="/admin" component={TestComponent} testProp="test value" />
                </MemoryRouter>
            </Provider>
        );

        // Assert
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
        expect(screen.getByText('Admin Component with prop: test value')).toBeInTheDocument();
    });
});
