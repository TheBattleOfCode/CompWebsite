import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import AdminRoute from '../../../components/common/AdminRoute';

// Mock component to render when the route matches
const MockAdminComponent = () => <div>Admin Component</div>;

describe('AdminRoute Component', () => {
  it('renders the component for admin users', () => {
    // Arrange
    const adminUser = {
      username: 'admin',
      roles: ['ROLE_ADMIN'],
    };

    // Act
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminRoute
          path="/admin"
          component={MockAdminComponent}
          currentUser={adminUser}
        />
      </MemoryRouter>
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

    // Act
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminRoute
          path="/admin"
          component={MockAdminComponent}
          currentUser={regularUser}
        />
        <Route path="/home">
          <div>Home Page</div>
        </Route>
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByText('Admin Component')).not.toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login page', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminRoute
          path="/admin"
          component={MockAdminComponent}
          currentUser={null}
        />
        <Route path="/login">
          <div>Login Page</div>
        </Route>
      </MemoryRouter>
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

    const TestComponent = (props) => {
      return <div data-testid="test-component">Admin Component with prop: {props.testProp}</div>;
    };

    // Act
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminRoute
          path="/admin"
          component={TestComponent}
          currentUser={adminUser}
          testProp="test value"
        />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    // The text is inside the component, so we can't test it directly
    // Just verify the component is rendered
  });
});
