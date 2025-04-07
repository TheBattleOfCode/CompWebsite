import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import Home from '../../../components/Home';

// Mock the HomeScreen component
jest.mock('../../../components/Home/HomeScreen', () => {
    return function MockHomeScreen() {
        return <div data-testid="home-screen">HomeScreen Component</div>;
    };
});

describe('Home Component', () => {
    it('renders the HomeScreen component', () => {
        // Arrange & Act
        render(<Home />);

        // Assert
        expect(screen.getByTestId('home-screen')).toBeInTheDocument();
        expect(screen.getByText('HomeScreen Component')).toBeInTheDocument();
    });

    it('renders inside a container', () => {
        // Arrange & Act
        render(<Home />);

        // Assert
        // Check that the HomeScreen is wrapped in a Container
        const container = screen.getByTestId('home-screen').parentElement;
        expect(container).toBeInTheDocument();
    });
});
