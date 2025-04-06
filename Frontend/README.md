# Battle of Code - Frontend

A competitive coding platform where users can solve programming challenges, track their progress, and compete with others.

## Features

- **User Authentication**: Secure login and registration system with JWT
- **Problem Solving**: Various types of programming challenges (Number Generator, Q&A, General)
- **User Profiles**: Customizable profiles with personal information and statistics
- **Leaderboards**: Track your progress against other users
- **Admin Panel**: Create and manage problems (admin-only access)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React**: Frontend library for building user interfaces
- **Redux Toolkit**: State management with RTK Query for data fetching
- **Material-UI**: React component library implementing Google's Material Design
- **React Router**: Navigation and routing
- **JWT**: Authentication using JSON Web Tokens
- **ESLint & Prettier**: Code quality and formatting
- **Husky**: Git hooks for pre-commit linting
- **Jest & React Testing Library**: Unit testing

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd CompWebsite/Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=8081
   REACT_APP_API_URL=http://localhost:8080/api
   NODE_ENV=development
   ```

## Running the Application

### Development Mode

```bash
npm start
```

This will start the development server at [http://localhost:8081](http://localhost:8081).

### Production Build

```bash
npm run build
```

This creates a production-ready build in the `build` folder.

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### Formatting

```bash
# Check formatting
npm run prettier:check

# Fix formatting issues
npm run prettier:write
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage
```

The project uses Jest and React Testing Library for unit testing. All tests are centralized in the `__tests__` directory with a structure that mirrors the main source code.

#### Test Structure

All tests are organized in a dedicated `__tests__` directory structure that mirrors the main source code:

- `src/setupTests.js` - Global test setup
- `src/__tests__/utils/test-utils.js` - Custom render function and test utilities
- `src/__tests__/components/` - Component tests organized by feature
- `src/__tests__/services/` - Service tests

This organization keeps tests separate from implementation code while maintaining a parallel structure for easy navigation.

#### Coverage Thresholds

The project aims for at least 50% code coverage across:

- Statements
- Branches
- Functions
- Lines

## Data Fetching with RTK Query

This project uses Redux Toolkit Query (RTK Query) for data fetching, caching, and state management. RTK Query provides several benefits:

- **Automatic Caching**: Cached data is automatically reused without refetching
- **Polling**: Automatic refetching at specified intervals
- **Deduplicated Requests**: Multiple components requesting the same data only trigger one request
- **Prefetching**: Data can be prefetched before it's needed
- **Optimistic Updates**: UI updates immediately while waiting for server confirmation
- **Normalized Cache**: Efficient data storage and retrieval
- **TypeScript Support**: Full type safety for API endpoints

### API Structure

The API is organized into domain-specific slices for better maintainability and debugging:

- **Base API Configuration**: `src/services/api/apiSlice.js`
- **Auth API**: `src/services/api/auth/authApiSlice.js`
- **Problems API**: `src/services/api/problems/problemsApiSlice.js`
- **Users API**: `src/services/api/users/usersApiSlice.js`
- **Countries API**: `src/services/api/countries/countriesApiSlice.js`

Each slice is responsible for a specific domain and includes all related endpoints. All slices and hooks are exported from `src/services/api/index.js` for easy access.

### Usage Example

```jsx
// In a component
import { useGetProblemsQuery } from '../services/api';

function ProblemList() {
  const { data: problems, isLoading, error } = useGetProblemsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {problems.map(problem => (
        <li key={problem._id}>{problem.title}</li>
      ))}
    </ul>
  );
}
```

### Service Migration

All API calls have been migrated from individual service files to RTK Query. The old service files are kept for backward compatibility, but they now use RTK Query under the hood and display deprecation warnings.

If you're working on a new component or refactoring an existing one, you should use the RTK Query hooks directly instead of the old service files.

#### Before (deprecated)

```jsx
import probService from '../services/prob.service';

// In a component
const fetchProblems = async () => {
  try {
    const response = await probService.GetProbs();
    setProblems(response.data);
  } catch (error) {
    console.error('Error fetching problems:', error);
  }
};
```

#### After (recommended)

```jsx
import { useGetProblemsQuery } from '../services/api';

// In a component
const { data: problems, isLoading, error } = useGetProblemsQuery();

// The data is automatically fetched and cached
// No need for loading state, error handling, or useEffect
```

## Project Structure

```text
Frontend/
├── public/                 # Static files
├── src/
│   ├── __tests__/          # Test files
│   │   ├── components/     # Component tests
│   │   │   ├── Home/       # Home component tests
│   │   │   ├── Login/      # Login component tests
│   │   │   └── common/     # Common component tests
│   │   ├── services/       # Service tests
│   │   └── utils/          # Test utilities
│   ├── app/                # Redux store configuration
│   │   └── store.js        # Redux store setup
│   ├── common/             # Common utilities
│   ├── components/         # React components
│   │   ├── CreateProblem/  # Admin component for creating problems
│   │   ├── Home/           # Home screen components
│   │   ├── Login/          # Login components
│   │   ├── Navbar/         # Navigation components
│   │   ├── ProblemSolver/  # Problem solving components
│   │   ├── Profile/        # User profile components
│   │   ├── Register/       # Registration components
│   │   ├── Standings/      # Leaderboard components
│   │   └── common/         # Shared components
│   ├── features/           # Redux slices and features
│   │   └── auth/           # Authentication slice
│   ├── services/           # API services
│   │   ├── api/            # RTK Query API slices
│   │   │   ├── auth/        # Auth API endpoints
│   │   │   ├── problems/    # Problems API endpoints
│   │   │   ├── users/       # Users API endpoints
│   │   │   ├── countries/   # Countries API endpoints
│   │   │   └── apiSlice.js  # Base API configuration
│   │   └── auth-header.js  # Authentication header utility
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── .env                    # Environment variables
├── .eslintrc.js            # ESLint configuration
├── .prettierrc.json        # Prettier configuration
└── package.json            # Project dependencies and scripts
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. When a user logs in, a token is stored in local storage and included in the headers of subsequent API requests.

## Role-Based Access Control

The application implements role-based access control:

- **Public routes**: Login, Register
- **Protected routes**: Home, Profile, Standings, Problem Solving
- **Admin-only routes**: Create Problem

## API Integration

The frontend communicates with a backend API. The base URL for API requests is configured in the `.env` file.

## Contributing

1. Make sure your code passes linting and formatting checks
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
