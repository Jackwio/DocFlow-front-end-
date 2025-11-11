import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DocumentManagement from './DocumentManagement';

describe('DocumentManagement Component', () => {
  test('renders page title', () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('Document Management')).toBeInTheDocument();
  });

  test('renders all documents section', () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('All Documents')).toBeInTheDocument();
  });

  test('renders upload button', () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('+ Upload New Document')).toBeInTheDocument();
  });

  test('renders document table with mock data', () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('Invoice_2024_Jan.pdf')).toBeInTheDocument();
    expect(screen.getByText('Contract_ClientA.docx')).toBeInTheDocument();
  });

  test('renders status badges', () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    const classifiedElements = screen.getAllByText('Classified');
    expect(classifiedElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Routed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  test('renders summary cards', () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('Total Documents')).toBeInTheDocument();
    const fives = screen.getAllByText('5');
    expect(fives.length).toBeGreaterThan(0);
  });
});
