import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SmartSearch from './SmartSearch';

describe('SmartSearch Component', () => {
  test('renders page title', () => {
    render(
      <BrowserRouter>
        <SmartSearch />
      </BrowserRouter>
    );
    expect(screen.getByText('Smart Search')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(
      <BrowserRouter>
        <SmartSearch />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/Search by name or tags/i)).toBeInTheDocument();
  });

  test('renders status filter', () => {
    render(
      <BrowserRouter>
        <SmartSearch />
      </BrowserRouter>
    );
    expect(screen.getByText('Filter by Status:')).toBeInTheDocument();
  });

  test('renders tag filter buttons', () => {
    render(
      <BrowserRouter>
        <SmartSearch />
      </BrowserRouter>
    );
    expect(screen.getByText('Filter by Tags:')).toBeInTheDocument();
    const invoiceButtons = screen.getAllByText('Invoice');
    expect(invoiceButtons.length).toBeGreaterThan(0);
    const financeButtons = screen.getAllByText('Finance');
    expect(financeButtons.length).toBeGreaterThan(0);
  });

  test('renders search results', () => {
    render(
      <BrowserRouter>
        <SmartSearch />
      </BrowserRouter>
    );
    expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
    expect(screen.getByText('Invoice_2024_Jan.pdf')).toBeInTheDocument();
  });
});
