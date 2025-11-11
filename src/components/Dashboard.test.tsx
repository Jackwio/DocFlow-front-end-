import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Welcome to DocFlow')).toBeInTheDocument();
  });

  test('renders subtitle', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Your comprehensive document management solution')).toBeInTheDocument();
  });

  test('renders all 7 feature cards', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Document Management')).toBeInTheDocument();
    expect(screen.getByText('Easy Upload')).toBeInTheDocument();
    expect(screen.getByText('Smart Search')).toBeInTheDocument();
    expect(screen.getByText('Status Tracking')).toBeInTheDocument();
    expect(screen.getByText('Tenant Settings')).toBeInTheDocument();
    expect(screen.getByText('Compliance & Audit')).toBeInTheDocument();
    expect(screen.getByText('AI Features')).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/Organize and manage all your documents/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload documents quickly and securely/i)).toBeInTheDocument();
    expect(screen.getByText(/Find documents easily with powerful search/i)).toBeInTheDocument();
  });

  test('feature cards have correct links', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    const documentLink = screen.getByRole('link', { name: /Document Management/i });
    expect(documentLink).toHaveAttribute('href', '/documents');
  });
});
