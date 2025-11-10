/**
 * Basic App component test
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders DocFlow header', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: 'DocFlow', level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<App />);
    const message = screen.getByText(/Welcome to DocFlow/i);
    expect(message).toBeInTheDocument();
  });
});
