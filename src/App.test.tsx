import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard with welcome message', () => {
  render(<App />);
  const heading = screen.getAllByText(/DocFlow/i);
  expect(heading.length).toBeGreaterThan(0);
});

test('renders main application', () => {
  render(<App />);
  // Just ensure the app renders without crashing
  expect(document.body).toBeTruthy();
});
