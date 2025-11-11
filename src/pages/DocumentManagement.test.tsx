import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DocumentManagement from './DocumentManagement';

// Mock the entire API module
jest.mock('../services/documentsApi');

const mockDocuments = [
  {
    id: 'doc-001',
    fileName: 'Invoice_2024_Jan.pdf',
    fileSize: 2048576,
    status: 1, // Classified
    uploadedAt: '2024-01-15T10:30:00Z',
    tags: ['Invoice', 'Finance', '2024'],
  },
  {
    id: 'doc-002',
    fileName: 'Contract_ClientA.docx',
    fileSize: 1536000,
    status: 3, // Routed
    uploadedAt: '2024-01-14T14:22:00Z',
    tags: ['Contract', 'Legal', 'ClientA'],
  },
  {
    id: 'doc-003',
    fileName: 'Report_Q4_2023.xlsx',
    fileSize: 3072000,
    status: 0, // Pending
    uploadedAt: '2024-01-16T09:15:00Z',
    tags: ['Report', 'Q4', '2023'],
  },
  {
    id: 'doc-004',
    fileName: 'Meeting_Notes.txt',
    fileSize: 10240,
    status: 2, // Failed
    uploadedAt: '2024-01-16T11:45:00Z',
    tags: ['Meeting', 'Notes'],
  },
  {
    id: 'doc-005',
    fileName: 'Presentation_2024.pptx',
    fileSize: 5120000,
    status: 1, // Classified
    uploadedAt: '2024-01-15T16:00:00Z',
    tags: ['Presentation', 'Marketing', '2024'],
  },
];

describe('DocumentManagement Component', () => {
  beforeEach(() => {
    // Setup mock implementation before each test
    const documentsApi = require('../services/documentsApi');
    documentsApi.documentsApi.getDocumentList = jest.fn().mockResolvedValue({
      items: mockDocuments,
      totalCount: 5,
    });
  });

  test('renders page title', async () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('Document Management')).toBeInTheDocument();
  });

  test('renders all documents section', async () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('All Documents')).toBeInTheDocument();
  });

  test('renders upload button', async () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    expect(screen.getByText('+ Upload New Document')).toBeInTheDocument();
  });

  test('renders document table with mock data', async () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Invoice_2024_Jan.pdf')).toBeInTheDocument();
    });
    expect(screen.getByText('Contract_ClientA.docx')).toBeInTheDocument();
  });

  test('renders status badges', async () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Invoice_2024_Jan.pdf')).toBeInTheDocument();
    });
    const classifiedElements = screen.getAllByText('Classified');
    expect(classifiedElements.length).toBeGreaterThan(0);
    // Check for multiple status values
    const routedElements = screen.getAllByText('Routed');
    expect(routedElements.length).toBeGreaterThan(0);
  });

  test('renders summary cards', async () => {
    render(
      <BrowserRouter>
        <DocumentManagement />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Total Documents')).toBeInTheDocument();
      const fives = screen.getAllByText('5');
      expect(fives.length).toBeGreaterThan(0);
    });
  });
});
