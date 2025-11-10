/**
 * Basic App component test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders DocFlow header', () => {
    render(<App />);
    const heading = screen.getByRole('heading', {
      name: /DocFlow - Document Intake & Classification/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders upload zone', () => {
    render(<App />);
    const uploadButton = screen.getByRole('button', { name: /Browse Files/i });
    expect(uploadButton).toBeInTheDocument();
  });
});
