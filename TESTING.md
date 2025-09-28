# Testing Guide

This document explains the simplified testing setup for the Plataforma Vuelos frontend application.

## Testing Stack

- **Vitest**: Fast unit test framework built for Vite
- **React Testing Library**: Simple and complete testing utilities for React components
- **jsdom**: DOM implementation for Node.js (for browser environment simulation)
- **@testing-library/user-event**: Advanced user interaction simulation

## What We Test

This simplified setup focuses on two key areas:
1. **Flight Filtering**: Tests the search and filter functionality on the Home page
2. **Flight Creation**: Tests the API service for creating new flights

## Setup

### 1. Install Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Configuration

The testing is configured in `vite.config.js`:

```javascript
export default defineConfig({
  // ... other config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
});
```

### 3. Test Setup

The `src/test/setup.js` file configures global test utilities and mocks:

- Sets up `@testing-library/jest-dom` matchers
- Mocks browser APIs like `window.confirm`, `window.alert`, and `window.location.reload`

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode (development)
npm test

# Run tests with UI interface
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Test Commands Explained

- `npm test`: Runs tests in watch mode, re-running when files change
- `npm run test:ui`: Opens a web-based UI for running and debugging tests
- `npm run test:run`: Runs all tests once and exits (useful for CI/CD)
- `npm run test:coverage`: Generates a coverage report showing which code is tested

## Test Structure

### File Organization

```
src/
├── test/
│   ├── setup.js          # Global test setup
│   └── utils.jsx         # Test utilities and helpers
├── components/
│   └── __tests__/        # Component tests
├── pages/
│   └── __tests__/        # Page tests
├── services/
│   └── __tests__/        # Service/API tests
└── constants/
    └── __tests__/        # Constants tests
```

### Test Naming Convention

- Test files should end with `.test.jsx` or `.test.js`
- Place tests in `__tests__` folders next to the code they test
- Use descriptive test names that explain the expected behavior

## Writing Tests

### Component Tests

Example component test:

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### API Service Tests

Example API test with mocking:

```javascript
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { api } from '../api';

vi.mock('axios');

describe('API Service', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    axios.get.mockResolvedValue({ data: mockData });
    
    const result = await api.getData();
    expect(result).toEqual(mockData);
  });
});
```

### Page Tests

Example page test with routing:

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  it('loads and displays content', async () => {
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Expected Content')).toBeInTheDocument();
    });
  });
});
```

## Test Utilities

### Custom Render Function

The `src/test/utils.jsx` file provides:

- `renderWithRouter()`: Renders components with React Router context
- `mockFlights`: Sample flight data for testing
- `mockApi`: Mocked API functions for testing

### Common Testing Patterns

#### Testing Async Operations

```javascript
it('handles async data loading', async () => {
  render(<Component />);
  
  // Wait for async operation to complete
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

#### Testing User Interactions

```javascript
it('handles form submission', async () => {
  const user = userEvent.setup();
  render(<FormComponent />);
  
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

#### Mocking External Dependencies

```javascript
// Mock the entire module
vi.mock('../services/api');

// Mock specific functions
const mockApi = vi.mocked(api);
mockApi.getFlights.mockResolvedValue(mockData);
```

## Best Practices

### 1. Test Behavior, Not Implementation

Focus on what the user sees and does, not internal implementation details.

```javascript
// Good: Tests user-visible behavior
expect(screen.getByText('Welcome, John')).toBeInTheDocument();

// Avoid: Tests implementation details
expect(component.state.userName).toBe('John');
```

### 2. Use Semantic Queries

Prefer queries that reflect how users interact with the UI:

```javascript
// Good: Semantic queries
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email Address');
screen.getByText('Welcome back');

// Avoid: Implementation-specific queries
screen.getByClassName('submit-btn');
screen.getByTestId('email-input');
```

### 3. Test Error States

Don't just test the happy path:

```javascript
it('displays error message when API fails', async () => {
  mockApi.getData.mockRejectedValue(new Error('API Error'));
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

### 4. Keep Tests Independent

Each test should be able to run in isolation:

```javascript
beforeEach(() => {
  // Reset mocks and state before each test
  vi.clearAllMocks();
});
```

### 5. Use Descriptive Test Names

Test names should clearly describe what is being tested:

```javascript
// Good
it('displays loading spinner while fetching flights');

// Avoid
it('works correctly');
```

## Coverage

The test coverage report shows which parts of your code are tested. Aim for:

- **Statements**: > 80%
- **Branches**: > 70%
- **Functions**: > 80%
- **Lines**: > 80%

Run coverage with:

```bash
npm run test:coverage
```

## Debugging Tests

### Using the Test UI

```bash
npm run test:ui
```

This opens a web interface where you can:
- Run individual tests
- See test results in real-time
- Debug failing tests
- View coverage reports

### Debugging in VS Code

Add this configuration to your `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "--reporter=verbose"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Issues and Solutions

### 1. "Cannot find module" errors

Make sure all dependencies are installed:

```bash
npm install
```

### 2. Tests timing out

Use `waitFor` for async operations:

```javascript
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### 3. Router context errors

Wrap components that use routing:

```javascript
render(
  <BrowserRouter>
    <Component />
  </BrowserRouter>
);
```

### 4. Mock not working

Ensure mocks are set up before imports:

```javascript
vi.mock('../api'); // Must be before import
import { api } from '../api';
```

## Continuous Integration

For CI/CD pipelines, use:

```bash
npm run test:run
```

This command:
- Runs all tests once
- Exits with appropriate code (0 for success, 1 for failure)
- Generates coverage reports
- Works well in automated environments

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vitest UI](https://vitest.dev/guide/ui.html)
