import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageLayout from './PageLayout';

describe('PageLayout Component', () => {
  test('renders page title', () => {
    render(
      <BrowserRouter>
        <PageLayout title="Test Page">
          <div>Test Content</div>
        </PageLayout>
      </BrowserRouter>
    );
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(
      <BrowserRouter>
        <PageLayout title="Test Page">
          <div>Test Content</div>
        </PageLayout>
      </BrowserRouter>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders back to dashboard button', () => {
    render(
      <BrowserRouter>
        <PageLayout title="Test Page">
          <div>Test Content</div>
        </PageLayout>
      </BrowserRouter>
    );
    const backButton = screen.getByText('← Back to Dashboard');
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', '/');
  });
});
