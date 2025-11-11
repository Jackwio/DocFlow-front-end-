import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EasyUpload from './EasyUpload';

describe('EasyUpload Component', () => {
  test('renders page title', () => {
    render(
      <BrowserRouter>
        <EasyUpload />
      </BrowserRouter>
    );
    expect(screen.getByText('Easy Upload')).toBeInTheDocument();
  });

  test('renders upload zone', () => {
    render(
      <BrowserRouter>
        <EasyUpload />
      </BrowserRouter>
    );
    expect(screen.getByText('Drop files here or click to browse')).toBeInTheDocument();
  });

  test('renders inbox selector', () => {
    render(
      <BrowserRouter>
        <EasyUpload />
      </BrowserRouter>
    );
    expect(screen.getByText('Select Target Inbox:')).toBeInTheDocument();
  });

  test('renders upload queue', () => {
    render(
      <BrowserRouter>
        <EasyUpload />
      </BrowserRouter>
    );
    expect(screen.getByText('Upload Queue')).toBeInTheDocument();
  });

  test('renders summary statistics', () => {
    render(
      <BrowserRouter>
        <EasyUpload />
      </BrowserRouter>
    );
    expect(screen.getByText('Total Files')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});
