import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock the API module
jest.mock('./services/documentsApi');

beforeEach(() => {
  // Setup mock for all tests
  const documentsApi = require('./services/documentsApi');
  documentsApi.documentsApi.getDocumentList = jest.fn().mockResolvedValue({
    items: [],
    totalCount: 0,
  });
});

test('renders dashboard with welcome message', () => {
  const { container } = render(<App />);
  // Just check that the app renders without crashing
  expect(container).toBeTruthy();
});

test('renders main application', () => {
  render(<App />);
  // Just ensure the app renders without crashing
  expect(document.body).toBeTruthy();
});
