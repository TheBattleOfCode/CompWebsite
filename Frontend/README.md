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
- **Material-UI**: React component library implementing Google's Material Design
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API requests
- **JWT**: Authentication using JSON Web Tokens
- **ESLint & Prettier**: Code quality and formatting
- **Husky**: Git hooks for pre-commit linting

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
│   ├── common/             # Common utilities
│   ├── components/         # React components
│   │   ├── CreateProblem/  # Admin component for creating problems
│   │   ├── Home/           # Home screen components
│   │   ├── Login/          # Login components
│   │   ├── Navbar/         # Navigation components
│   │   ├── ProbNumberGen/  # Problem solving components
│   │   ├── Profile/        # User profile components
│   │   ├── Register/       # Registration components
│   │   ├── Standings/      # Leaderboard components
│   │   └── common/         # Shared components
│   ├── services/           # API services
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
