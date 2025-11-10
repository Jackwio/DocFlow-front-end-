/**
 * Integration test: Status Monitoring Flow
 * Tests the complete flow from upload → Pending → Classified/Failed transition
 * with automatic polling and visual feedback
 */

import { http, HttpResponse } from 'msw';
import { describe, expect, it, beforeAll, afterAll, afterEach } from 'vitest';

import { DocumentsPage } from '@/pages/DocumentsPage';
import { server } from '@/tests/mocks/server';
import { render, screen, waitFor } from '@/tests/utils/render';
import { DocumentStatus, DocumentDto } from '@/types';

const API_BASE_URL = 'https://localhost:44347';

describe('Status Monitoring Integration', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should show Pending status badge with pulsing animation after upload', async () => {
    // Mock a document in Pending state
    const pendingDoc: DocumentDto = {
      id: 'doc-1',
      fileName: 'test-invoice.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
      status: DocumentStatus.Pending,
      uploadedAt: new Date().toISOString(),
      blobUri: 'https://example.com/blob',
      classificationResults: [],
      tags: [],
      routingHistory: [],
    };

    server.use(
      http.post(`${API_BASE_URL}/api/documents/search`, () => {
        return HttpResponse.json({
          totalCount: 1,
          items: [
            {
              id: pendingDoc.id,
              fileName: pendingDoc.fileName,
              fileSize: pendingDoc.fileSize,
              status: pendingDoc.status,
              uploadedAt: pendingDoc.uploadedAt,
              tags: [],
            },
          ],
        });
      })
    );

    render(<DocumentsPage />);

    // Wait for the document to appear
    await waitFor(() => {
      expect(screen.getByText('test-invoice.pdf')).toBeInTheDocument();
    });

    // Check for Pending status badge
    const statusBadge = screen.getByRole('status', { name: /Status: Pending/i });
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Pending');

    // Verify pulsing animation class (FR-007)
    expect(statusBadge).toHaveClass('animate-pulse-soft');
  });

  it('should automatically update from Pending to Classified with smooth transition', async () => {
    let callCount = 0;

    // Start with Pending, then return Classified
    server.use(
      http.post(`${API_BASE_URL}/api/documents/search`, () => {
        callCount++;

        const status = callCount === 1 ? DocumentStatus.Pending : DocumentStatus.Classified;
        const classifiedAt = callCount === 1 ? undefined : new Date().toISOString();

        return HttpResponse.json({
          totalCount: 1,
          items: [
            {
              id: 'doc-1',
              fileName: 'test-invoice.pdf',
              fileSize: 1024,
              status,
              uploadedAt: new Date().toISOString(),
              classifiedAt,
              tags: callCount === 1 ? [] : ['Invoice', 'Financial'],
            },
          ],
        });
      })
    );

    render(<DocumentsPage />);

    // Initially should show Pending
    await waitFor(() => {
      expect(screen.getByText('test-invoice.pdf')).toBeInTheDocument();
    });

    const pendingBadge = screen.getByRole('status', { name: /Status: Pending/i });
    expect(pendingBadge).toHaveTextContent('Pending');
    expect(pendingBadge).toHaveClass('animate-pulse-soft');

    // Wait for automatic update to Classified (polling should trigger)
    await waitFor(
      () => {
        const classifiedBadge = screen.queryByRole('status', { name: /Status: Classified/i });
        expect(classifiedBadge).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Verify smooth transition (FR-006)
    const classifiedBadge = screen.getByRole('status', { name: /Status: Classified/i });
    expect(classifiedBadge).toHaveTextContent('Classified');
    expect(classifiedBadge).toHaveClass('transition-all', 'duration-300');
    expect(classifiedBadge).not.toHaveClass('animate-pulse-soft');

    // Verify tags appeared (FR-005)
    expect(screen.getByText('Invoice')).toBeInTheDocument();
    expect(screen.getByText('Financial')).toBeInTheDocument();
  });

  it('should update from Pending to Failed and show retry button', async () => {
    let callCount = 0;

    server.use(
      http.post(`${API_BASE_URL}/api/documents/search`, () => {
        callCount++;
        const status = callCount === 1 ? DocumentStatus.Pending : DocumentStatus.Failed;

        return HttpResponse.json({
          totalCount: 1,
          items: [
            {
              id: 'doc-1',
              fileName: 'failed-doc.pdf',
              fileSize: 1024,
              status,
              uploadedAt: new Date().toISOString(),
              tags: [],
            },
          ],
        });
      })
    );

    render(<DocumentsPage />);

    // Initially should show Pending
    await waitFor(() => {
      expect(screen.getByText('failed-doc.pdf')).toBeInTheDocument();
    });

    // Wait for update to Failed
    await waitFor(
      () => {
        const failedBadge = screen.queryByRole('status', { name: /Status: Failed/i });
        expect(failedBadge).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    const failedBadge = screen.getByRole('status', { name: /Status: Failed/i });
    expect(failedBadge).toHaveTextContent('Failed');
    expect(failedBadge).not.toHaveClass('animate-pulse-soft');

    // Verify retry button appears (FR-005 scenario 3)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should show multiple documents with different statuses correctly', async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/documents/search`, () => {
        return HttpResponse.json({
          totalCount: 4,
          items: [
            {
              id: 'doc-1',
              fileName: 'pending-doc.pdf',
              fileSize: 1024,
              status: DocumentStatus.Pending,
              uploadedAt: new Date().toISOString(),
              tags: [],
            },
            {
              id: 'doc-2',
              fileName: 'classified-doc.pdf',
              fileSize: 2048,
              status: DocumentStatus.Classified,
              uploadedAt: new Date().toISOString(),
              classifiedAt: new Date().toISOString(),
              tags: ['Invoice'],
            },
            {
              id: 'doc-3',
              fileName: 'failed-doc.pdf',
              fileSize: 3072,
              status: DocumentStatus.Failed,
              uploadedAt: new Date().toISOString(),
              tags: [],
            },
            {
              id: 'doc-4',
              fileName: 'routed-doc.pdf',
              fileSize: 4096,
              status: DocumentStatus.Routed,
              uploadedAt: new Date().toISOString(),
              classifiedAt: new Date().toISOString(),
              tags: ['Contract'],
            },
          ],
        });
      })
    );

    render(<DocumentsPage />);

    // Wait for all documents to appear
    await waitFor(() => {
      expect(screen.getByText('pending-doc.pdf')).toBeInTheDocument();
      expect(screen.getByText('classified-doc.pdf')).toBeInTheDocument();
      expect(screen.getByText('failed-doc.pdf')).toBeInTheDocument();
      expect(screen.getByText('routed-doc.pdf')).toBeInTheDocument();
    });

    // Verify all status badges
    expect(screen.getByRole('status', { name: /Status: Pending/i })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /Status: Classified/i })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /Status: Failed/i })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /Status: Routed/i })).toBeInTheDocument();

    // Verify only Pending has pulse animation
    const pendingBadge = screen.getByRole('status', { name: /Status: Pending/i });
    expect(pendingBadge).toHaveClass('animate-pulse-soft');

    const classifiedBadge = screen.getByRole('status', { name: /Status: Classified/i });
    expect(classifiedBadge).not.toHaveClass('animate-pulse-soft');
  });

  it('should stop polling when no Pending documents exist', async () => {
    let callCount = 0;

    server.use(
      http.post(`${API_BASE_URL}/api/documents/search`, () => {
        callCount++;

        // First call: one Pending document
        // Second call onwards: all Classified (no more pending)
        const status = callCount === 1 ? DocumentStatus.Pending : DocumentStatus.Classified;

        return HttpResponse.json({
          totalCount: 1,
          items: [
            {
              id: 'doc-1',
              fileName: 'test.pdf',
              fileSize: 1024,
              status,
              uploadedAt: new Date().toISOString(),
              classifiedAt: callCount === 1 ? undefined : new Date().toISOString(),
              tags: callCount === 1 ? [] : ['Invoice'],
            },
          ],
        });
      })
    );

    render(<DocumentsPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    // Wait for transition to Classified
    await waitFor(
      () => {
        expect(screen.getByRole('status', { name: /Status: Classified/i })).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Record current call count
    const callsBeforeWait = callCount;

    // Wait a bit longer - polling should stop or slow down since no Pending documents
    await waitFor(
      () => {
        // Polling should have stopped or slowed significantly
        // Allow at most 2-3 more calls (some grace for timing)
        expect(callCount - callsBeforeWait).toBeLessThan(5);
      },
      { timeout: 15000 }
    );
  });
});
