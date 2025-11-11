import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StatusTracking from './StatusTracking';

describe('StatusTracking Component', () => {
  test('renders page title', () => {
    render(
      <BrowserRouter>
        <StatusTracking />
      </BrowserRouter>
    );
    expect(screen.getByText('Status Tracking')).toBeInTheDocument();
  });

  test('renders status overview', () => {
    render(
      <BrowserRouter>
        <StatusTracking />
      </BrowserRouter>
    );
    expect(screen.getByText('Document Status Overview')).toBeInTheDocument();
  });

  test('renders status cards', () => {
    render(
      <BrowserRouter>
        <StatusTracking />
      </BrowserRouter>
    );
    expect(screen.getByText('📊 Total Documents')).toBeInTheDocument();
    expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
    expect(screen.getByText('✅ Classified')).toBeInTheDocument();
  });

  test('renders status workflow', () => {
    render(
      <BrowserRouter>
        <StatusTracking />
      </BrowserRouter>
    );
    expect(screen.getByText('Status Workflow')).toBeInTheDocument();
    const pendingElements = screen.getAllByText(/Pending/);
    expect(pendingElements.length).toBeGreaterThan(0);
  });

  test('renders document list', () => {
    render(
      <BrowserRouter>
        <StatusTracking />
      </BrowserRouter>
    );
    expect(screen.getByText('Invoice_2024_Jan.pdf')).toBeInTheDocument();
    expect(screen.getByText('Meeting_Notes.txt')).toBeInTheDocument();
  });
});
