/**
 * MSW request handlers for mocking API
 */

import { http, HttpResponse } from 'msw';

import { mockDocuments, createMockDocument } from './data';

import type { DocumentDto, DocumentListDto, PagedResultDto } from '@/types';

const API_BASE_URL = 'https://localhost:44347';

export const handlers = [
  // Upload single document
  http.post(`${API_BASE_URL}/api/documents/upload`, () => {
    const mockDoc = createMockDocument();
    return HttpResponse.json<DocumentDto>(mockDoc, { status: 200 });
  }),

  // Upload batch
  http.post(`${API_BASE_URL}/api/documents/upload-batch`, () => {
    const docs = [createMockDocument(), createMockDocument()];
    return HttpResponse.json<DocumentDto[]>(docs, { status: 200 });
  }),

  // Get single document
  http.get(`${API_BASE_URL}/api/documents/:id`, ({ params }) => {
    const { id } = params;
    const doc = mockDocuments.find((d) => d.id === id);
    if (doc) {
      return HttpResponse.json<DocumentDto>(doc, { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Get document list
  http.get(`${API_BASE_URL}/api/documents`, ({ request }) => {
    const url = new URL(request.url);
    const skipCount = parseInt(url.searchParams.get('skipCount') || '0');
    const maxResultCount = parseInt(url.searchParams.get('maxResultCount') || '20');

    // Convert DocumentDto to DocumentListDto (simplified version)
    const items: DocumentListDto[] = mockDocuments
      .slice(skipCount, skipCount + maxResultCount)
      .map((doc) => ({
        id: doc.id,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        status: doc.status,
        uploadedAt: doc.uploadedAt,
        classifiedAt: doc.classifiedAt,
        tags: doc.tags.map((tag) => tag.name), // Extract tag names
      }));

    const result: PagedResultDto<DocumentListDto> = {
      totalCount: mockDocuments.length,
      items,
    };

    return HttpResponse.json(result, { status: 200 });
  }),

  // Search documents
  http.post(`${API_BASE_URL}/api/documents/search`, () => {
    // Convert DocumentDto to DocumentListDto
    const items: DocumentListDto[] = mockDocuments.slice(0, 10).map((doc) => ({
      id: doc.id,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      status: doc.status,
      uploadedAt: doc.uploadedAt,
      classifiedAt: doc.classifiedAt,
      tags: doc.tags.map((tag) => tag.name), // Extract tag names
    }));

    const result: PagedResultDto<DocumentListDto> = {
      totalCount: mockDocuments.length,
      items,
    };
    return HttpResponse.json(result, { status: 200 });
  }),

  // Retry classification
  http.post(`${API_BASE_URL}/api/documents/:id/retry`, ({ params }) => {
    const { id } = params;
    const doc = mockDocuments.find((d) => d.id === id);
    if (doc) {
      return HttpResponse.json<DocumentDto>({ ...doc, status: 0 }, { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Add manual tag
  http.post(`${API_BASE_URL}/api/documents/:id/tags`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { tagName: string };
    const doc = mockDocuments.find((d) => d.id === id);
    
    if (!doc) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json<DocumentDto>(
      {
        ...doc,
        tags: [
          ...doc.tags,
          {
            name: body.tagName,
            source: 1,
            addedAt: new Date().toISOString(),
            addedBy: 'user@example.com',
          },
        ],
      },
      { status: 200 }
    );
  }),

  // Remove manual tag
  http.delete(`${API_BASE_URL}/api/documents/:id/tags/:tagName`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Get classification history
  http.get(`${API_BASE_URL}/api/documents/:id/history`, ({ params }) => {
    const { id } = params;
    const doc = mockDocuments.find((d) => d.id === id);
    if (doc) {
      return HttpResponse.json<DocumentDto>(doc, { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
