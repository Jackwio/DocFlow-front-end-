import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DocFlow header', () => {
  render(<App />);
  const headerElement = screen.getByText(/DocFlow/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders Dashboard page by default', () => {
  render(<App />);
  const dashboardHeading = screen.getByRole('heading', { name: /Dashboard/i, level: 1 });
  expect(dashboardHeading).toBeInTheDocument();
});
