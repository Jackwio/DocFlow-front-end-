import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DocFlow welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to DocFlow/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  const homeLink = screen.getByRole('link', { name: /Home/i });
  const documentsLink = screen.getByRole('link', { name: /^Documents$/i });
  const uploadLink = screen.getByRole('link', { name: /Upload/i });
  expect(homeLink).toBeInTheDocument();
  expect(documentsLink).toBeInTheDocument();
  expect(uploadLink).toBeInTheDocument();
});
