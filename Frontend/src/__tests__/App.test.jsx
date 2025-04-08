import { describe, it, expect, vi } from 'vitest';

import App from '../App';

import { render } from './utils/test-utils.jsx';

// Mock the components used in App
vi.mock('../components/Login/Login.jsx', () => ({
  default: () => <div data-testid="login-component">Login Component</div>,
}));

vi.mock('../components/Register/Register.jsx', () => ({
  default: () => <div data-testid="register-component">Register Component</div>,
}));

vi.mock('../components/Home/Home.jsx', () => ({
  default: () => <div data-testid="home-component">Home Component</div>,
}));

vi.mock('../components/Profile/Profile.jsx', () => ({
  default: () => <div data-testid="profile-component">Profile Component</div>,
}));

vi.mock('../components/Navbar/Navbar.jsx', () => ({
  default: () => <div data-testid="navbar-component">Navbar Component</div>,
}));

vi.mock('../components/Standings/Standings.jsx', () => ({
  default: () => <div data-testid="standings-component">Standings Component</div>,
}));

vi.mock('../components/ProblemSolver/ProblemSolver.jsx', () => ({
  default: () => <div data-testid="problem-solver-component">Problem Solver Component</div>,
}));

vi.mock('../components/CreateProblem/CreateProblem.jsx', () => ({
  default: () => <div data-testid="create-problem-component">Create Problem Component</div>,
}));

// Mock Redux state
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn().mockImplementation((selector) => {
      // Mock the auth state
      const state = {
        auth: {
          user: null,
          isAdmin: false,
        },
      };
      return selector(state);
    }),
  };
});

describe('App Component', () => {
  it('renders without crashing', () => {
    // Render the App component
    const { container } = render(<App />);
    // Check that the container is defined
    expect(container).toBeDefined();
  });
});
