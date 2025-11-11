import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TenantSettings from './TenantSettings';

describe('TenantSettings Component', () => {
  test('renders page title', () => {
    render(
      <BrowserRouter>
        <TenantSettings />
      </BrowserRouter>
    );
    expect(screen.getByText('Tenant Settings')).toBeInTheDocument();
  });

  test('renders tenant configuration', () => {
    render(
      <BrowserRouter>
        <TenantSettings />
      </BrowserRouter>
    );
    expect(screen.getByText('Tenant Configuration')).toBeInTheDocument();
  });

  test('renders usage statistics', () => {
    render(
      <BrowserRouter>
        <TenantSettings />
      </BrowserRouter>
    );
    expect(screen.getByText('📦 Storage Used')).toBeInTheDocument();
    expect(screen.getByText('📄 Documents')).toBeInTheDocument();
    expect(screen.getByText('🤖 AI Features')).toBeInTheDocument();
  });

  test('renders inbox management section', () => {
    render(
      <BrowserRouter>
        <TenantSettings />
      </BrowserRouter>
    );
    expect(screen.getByText('Inbox Management')).toBeInTheDocument();
    expect(screen.getByText('+ Create New Inbox')).toBeInTheDocument();
  });

  test('renders inbox list', () => {
    render(
      <BrowserRouter>
        <TenantSettings />
      </BrowserRouter>
    );
    const financeElements = screen.getAllByText('Finance');
    expect(financeElements.length).toBeGreaterThan(0);
    const legalElements = screen.getAllByText('Legal');
    expect(legalElements.length).toBeGreaterThan(0);
    const marketingElements = screen.getAllByText('Marketing');
    expect(marketingElements.length).toBeGreaterThan(0);
  });

  test('renders classification rules section', () => {
    render(
      <BrowserRouter>
        <TenantSettings />
      </BrowserRouter>
    );
    expect(screen.getByText('Classification Rules')).toBeInTheDocument();
    expect(screen.getByText('+ Create New Rule')).toBeInTheDocument();
  });

  test('renders configuration options', () => {
    render(
      <BrowserRouter>
        <TenantSettings />
      </BrowserRouter>
    );
    expect(screen.getByText('⚙️ Configuration Options')).toBeInTheDocument();
  });
});
