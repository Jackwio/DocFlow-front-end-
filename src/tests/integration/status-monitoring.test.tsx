/**
 * Integration test for status monitoring flow
 * Tests upload → Pending → Classified transition with automatic polling
 * Task T083: [US2] Integration test for status monitoring flow
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/tests/utils/render';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';
import { DocumentStatus } from '@/types';

describe('Status Monitoring Flow (Integration)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should show document transitioning from Pending to Classified', async () => {
    const user = userEvent.setup({ delay: null });

    // Mock document that will transition states
    let documentStatus = DocumentStatus.Pending;
    const documentId = 'test-doc-123';

    // Override the default handlers for this test
    server.use(
      // Upload handler
      http.post('*/api/v1/documents/upload', async () => {
        return HttpResponse.json({
          id: documentId,
          name: 'test-document.pdf',
          uploadedAt: new Date().toISOString(),
          status: DocumentStatus.Pending,
          tags: [],
        });
      }),

      // Get documents handler - returns current status
      http.get('*/api/v1/documents', () => {
        return HttpResponse.json({
          items: [
            {
              id: documentId,
              name: 'test-document.pdf',
              uploadedAt: new Date().toISOString(),
              status: documentStatus,
              tags: documentStatus === DocumentStatus.Classified 
                ? [{ id: '1', name: 'Invoice', source: 'Automatic', confidence: 0.95 }]
                : [],
            },
          ],
          totalCount: 1,
          page: 1,
          pageSize: 10,
        });
      })
    );

    // Render the documents page
    renderWithProviders(<DocumentsPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Create a file to upload
    const file = new File(['test content'], 'test-document.pdf', { type: 'application/pdf' });

    // Find and interact with upload zone
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    });

    // Verify document shows Pending status
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    // Verify Pending badge has pulsing animation
    const pendingBadge = screen.getByRole('status', { name: /status: pending/i });
    expect(pendingBadge).toHaveClass('animate-pulse-soft');

    // Simulate backend classification completing
    // After 5 seconds, the document status changes to Classified
    documentStatus = DocumentStatus.Classified;

    // Advance timers to trigger polling (5 second interval)
    vi.advanceTimersByTime(5000);

    // Wait for the status to update to Classified
    await waitFor(() => {
      expect(screen.getByText('Classified')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify Classified badge appears with proper styling
    const classifiedBadge = screen.getByRole('status', { name: /status: classified/i });
    expect(classifiedBadge).toBeInTheDocument();
    expect(classifiedBadge).not.toHaveClass('animate-pulse-soft');

    // Verify smooth transition animation is applied
    expect(classifiedBadge).toHaveClass('transition-all', 'duration-300');

    // Verify classification tag appears
    await waitFor(() => {
      expect(screen.getByText('Invoice')).toBeInTheDocument();
    });

    // Verify tag badge is displayed
    const tagBadge = screen.getByRole('status', { name: /tag: invoice/i });
    expect(tagBadge).toBeInTheDocument();
  });

  it('should show document transitioning from Pending to Failed with retry button', async () => {
    const user = userEvent.setup({ delay: null });

    let documentStatus = DocumentStatus.Pending;
    const documentId = 'test-doc-456';

    server.use(
      http.post('*/api/v1/documents/upload', async () => {
        return HttpResponse.json({
          id: documentId,
          name: 'failed-document.pdf',
          uploadedAt: new Date().toISOString(),
          status: DocumentStatus.Pending,
          tags: [],
        });
      }),

      http.get('*/api/v1/documents', () => {
        return HttpResponse.json({
          items: [
            {
              id: documentId,
              name: 'failed-document.pdf',
              uploadedAt: new Date().toISOString(),
              status: documentStatus,
              tags: [],
            },
          ],
          totalCount: 1,
          page: 1,
          pageSize: 10,
        });
      }),

      // Retry classification handler
      http.post(`*/api/v1/documents/${documentId}/retry-classification`, async () => {
        documentStatus = DocumentStatus.Pending;
        return HttpResponse.json({
          id: documentId,
          name: 'failed-document.pdf',
          uploadedAt: new Date().toISOString(),
          status: DocumentStatus.Pending,
          tags: [],
        });
      })
    );

    renderWithProviders(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const file = new File(['test content'], 'failed-document.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('failed-document.pdf')).toBeInTheDocument();
    });

    // Verify Pending status
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    // Simulate classification failure
    documentStatus = DocumentStatus.Failed;
    vi.advanceTimersByTime(5000);

    // Wait for Failed status
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    // Verify Failed badge styling
    const failedBadge = screen.getByRole('status', { name: /status: failed/i });
    expect(failedBadge).toBeInTheDocument();
    expect(failedBadge).not.toHaveClass('animate-pulse-soft');

    // Verify retry button appears
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    // Status should go back to Pending
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('should continuously poll while documents have Pending status', async () => {
    const user = userEvent.setup({ delay: null });
    const getDocumentsSpy = vi.fn();

    let documentStatus = DocumentStatus.Pending;
    const documentId = 'test-doc-789';

    server.use(
      http.post('*/api/v1/documents/upload', async () => {
        return HttpResponse.json({
          id: documentId,
          name: 'polling-test.pdf',
          uploadedAt: new Date().toISOString(),
          status: DocumentStatus.Pending,
          tags: [],
        });
      }),

      http.get('*/api/v1/documents', () => {
        getDocumentsSpy();
        return HttpResponse.json({
          items: [
            {
              id: documentId,
              name: 'polling-test.pdf',
              uploadedAt: new Date().toISOString(),
              status: documentStatus,
              tags: [],
            },
          ],
          totalCount: 1,
          page: 1,
          pageSize: 10,
        });
      })
    );

    renderWithProviders(<DocumentsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const initialCallCount = getDocumentsSpy.mock.calls.length;

    const file = new File(['test content'], 'polling-test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('polling-test.pdf')).toBeInTheDocument();
    });

    // Polling should be active with Pending document
    // Advance time by 5 seconds (one polling interval)
    vi.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(getDocumentsSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    const pollCount1 = getDocumentsSpy.mock.calls.length;

    // Advance another 5 seconds
    vi.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(getDocumentsSpy.mock.calls.length).toBeGreaterThan(pollCount1);
    });

    // Change status to Classified (no longer pending)
    documentStatus = DocumentStatus.Classified;
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByText('Classified')).toBeInTheDocument();
    });

    const pollCount2 = getDocumentsSpy.mock.calls.length;

    // Polling should stop or slow down after no pending documents
    // Advance significant time
    vi.advanceTimersByTime(15000);

    // Should not have made many more calls
    expect(getDocumentsSpy.mock.calls.length).toBeLessThan(pollCount2 + 3);
  });

  it('should handle multiple documents with different statuses', async () => {
    const user = userEvent.setup({ delay: null });

    server.use(
      http.get('*/api/v1/documents', () => {
        return HttpResponse.json({
          items: [
            {
              id: 'doc-1',
              name: 'document-1.pdf',
              uploadedAt: new Date().toISOString(),
              status: DocumentStatus.Pending,
              tags: [],
            },
            {
              id: 'doc-2',
              name: 'document-2.pdf',
              uploadedAt: new Date().toISOString(),
              status: DocumentStatus.Classified,
              tags: [{ id: '1', name: 'Invoice', source: 'Automatic', confidence: 0.95 }],
            },
            {
              id: 'doc-3',
              name: 'document-3.pdf',
              uploadedAt: new Date().toISOString(),
              status: DocumentStatus.Failed,
              tags: [],
            },
          ],
          totalCount: 3,
          page: 1,
          pageSize: 10,
        });
      })
    );

    renderWithProviders(<DocumentsPage />);

    // Wait for documents to load
    await waitFor(() => {
      expect(screen.getByText('document-1.pdf')).toBeInTheDocument();
      expect(screen.getByText('document-2.pdf')).toBeInTheDocument();
      expect(screen.getByText('document-3.pdf')).toBeInTheDocument();
    });

    // Verify all three status badges are present
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Classified')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();

    // Verify Pending badge has animation
    const pendingBadge = screen.getByRole('status', { name: /status: pending/i });
    expect(pendingBadge).toHaveClass('animate-pulse-soft');

    // Verify Classified badge does not have animation
    const classifiedBadge = screen.getByRole('status', { name: /status: classified/i });
    expect(classifiedBadge).not.toHaveClass('animate-pulse-soft');

    // Verify tag is shown for classified document
    expect(screen.getByText('Invoice')).toBeInTheDocument();

    // Verify retry button for failed document
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
