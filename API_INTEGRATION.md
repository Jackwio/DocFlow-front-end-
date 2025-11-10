# API Integration Guide

This guide explains how the frontend integrates with the Documents API backend.

## Overview

The DocFlow frontend is a React single-page application that communicates with the Documents API backend via REST endpoints. The integration is built using:

- **Axios**: HTTP client with request/response interceptors
- **TanStack Query**: Server state management with caching and automatic refetching
- **TypeScript**: Type-safe API contracts and responses
- **MSW**: API mocking for development and testing

## Architecture

```
┌─────────────┐
│   React     │
│ Components  │
└─────┬───────┘
      │
┌─────▼───────┐
│   Custom    │
│   Hooks     │  (useDocuments, useDocumentUpload, etc.)
└─────┬───────┘
      │
┌─────▼───────┐
│  TanStack   │
│   Query     │  (Caching, invalidation, polling)
└─────┬───────┘
      │
┌─────▼───────┐
│   API       │
│  Service    │  (DocumentsApiService)
└─────┬───────┘
      │
┌─────▼───────┐
│   Axios     │
│   Client    │  (HTTP requests, interceptors)
└─────┬───────┘
      │
┌─────▼───────┐
│  Documents  │
│     API     │  (Backend REST API)
└─────────────┘
```

## API Client Configuration

### Base Configuration

Located in `src/services/api/client.ts`:

```typescript
import { getApiClient } from './client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44347';
```

### Request Interceptor

Automatically adds JWT Bearer token to all requests:

```typescript
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles errors and unauthorized responses:

```typescript
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## API Service Layer

### DocumentsApiService

Located in `src/services/api/documents.ts`, this service encapsulates all document-related API calls:

```typescript
export class DocumentsApiService {
  static async uploadDocument(file: File, fileName?: string, description?: string): Promise<DocumentDto>
  static async uploadBatch(files: File[]): Promise<DocumentDto[]>
  static async getDocument(id: string): Promise<DocumentDto>
  static async getDocumentList(params?: GetDocumentListParams): Promise<PagedResultDto<DocumentListDto>>
  static async retryClassification(id: string): Promise<DocumentDto>
  static async searchDocuments(criteria: DocumentSearchDto): Promise<PagedResultDto<DocumentListDto>>
  static async addManualTag(id: string, tagDto: AddManualTagDto): Promise<DocumentDto>
  static async removeManualTag(id: string, tagName: string): Promise<void>
  static async getClassificationHistory(id: string): Promise<DocumentDto>
}
```

## Custom Hooks

All API interactions go through React Query hooks for optimal caching and state management.

### Query Hooks (GET operations)

#### useDocuments

Fetches paginated document list with automatic polling for pending documents:

```typescript
import { useDocuments } from '@/hooks/useDocuments';

function MyComponent() {
  const { documents, totalCount, isLoading, error } = useDocuments({
    status: DocumentStatus.Classified,
    maxResultCount: 20,
  });
  
  return <DocumentList documents={documents} />;
}
```

**Features:**
- Automatic refetch every 5 seconds if pending documents exist
- 30-second stale time
- Automatic background refetching

#### useDocumentDetail

Fetches single document details:

```typescript
import { useDocumentDetail } from '@/hooks/useDocumentDetail';

function DocumentDetail({ documentId }: { documentId: string }) {
  const { data: document, isLoading } = useDocumentDetail({ 
    documentId,
    enabled: !!documentId 
  });
  
  return <div>{document?.fileName}</div>;
}
```

#### useDocumentSearch

Advanced search with multiple criteria:

```typescript
import { useDocumentSearch } from '@/hooks/useDocumentSearch';

function SearchResults() {
  const { documents, totalCount } = useDocumentSearch({
    fileName: 'invoice',
    status: DocumentStatus.Classified,
    tags: ['Urgent'],
    uploadedAfter: '2024-01-01',
  });
  
  return <DocumentList documents={documents} />;
}
```

#### useClassificationHistory

Fetches complete classification and routing history:

```typescript
import { useClassificationHistory } from '@/hooks/useClassificationHistory';

function ClassificationTimeline({ documentId }: { documentId: string }) {
  const { data: history } = useClassificationHistory({ documentId });
  
  return (
    <div>
      {history?.classificationResults.map(result => (
        <div key={result.ruleId}>{result.ruleName}</div>
      ))}
    </div>
  );
}
```

### Mutation Hooks (POST/PUT/DELETE operations)

#### useDocumentUpload

Uploads documents with progress tracking:

```typescript
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

function UploadButton() {
  const uploadMutation = useDocumentUpload();
  
  const handleUpload = (file: File) => {
    uploadMutation.mutate({
      file,
      fileName: 'custom-name.pdf',
      onProgress: ({ percentage }) => {
        console.log(`Upload progress: ${percentage}%`);
      }
    });
  };
  
  return (
    <button onClick={() => handleUpload(file)} disabled={uploadMutation.isPending}>
      {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
    </button>
  );
}
```

**Features:**
- Real-time upload progress callbacks
- Automatic document list invalidation on success
- Toast notifications for success/error
- Optimistic updates

#### useRetryClassification

Retries failed document classifications:

```typescript
import { useRetryClassification } from '@/hooks/useRetryClassification';

function RetryButton({ documentId }: { documentId: string }) {
  const retryMutation = useRetryClassification();
  
  return (
    <button 
      onClick={() => retryMutation.mutate(documentId)}
      disabled={retryMutation.isPending}
    >
      Retry Classification
    </button>
  );
}
```

#### useAddManualTag

Adds manual tags to documents:

```typescript
import { useAddManualTag } from '@/hooks/useAddManualTag';

function AddTagForm({ documentId }: { documentId: string }) {
  const addTagMutation = useAddManualTag();
  const [tagName, setTagName] = useState('');
  
  const handleSubmit = () => {
    addTagMutation.mutate({ documentId, tagName });
    setTagName('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={tagName} onChange={e => setTagName(e.target.value)} />
      <button type="submit">Add Tag</button>
    </form>
  );
}
```

#### useRemoveManualTag

Removes manual tags from documents:

```typescript
import { useRemoveManualTag } from '@/hooks/useRemoveManualTag';

function TagList({ documentId, tags }: Props) {
  const removeTagMutation = useRemoveManualTag();
  
  return (
    <div>
      {tags.map(tag => (
        <span key={tag.name}>
          {tag.name}
          {tag.source === TagSource.Manual && (
            <button onClick={() => removeTagMutation.mutate({ documentId, tagName: tag.name })}>
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
```

## Type Safety

All API requests and responses are fully typed using TypeScript interfaces:

### Document Types

```typescript
interface DocumentDto {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  status: DocumentStatus;
  uploadedAt: string;
  classifiedAt?: string;
  blobUri: string;
  classificationResults: ClassificationResultDto[];
  tags: TagDto[];
  routingHistory: RoutingHistoryDto[];
}

enum DocumentStatus {
  Pending = 0,
  Classified = 1,
  Failed = 2,
  Routed = 3,
}
```

### API Response Types

```typescript
interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## Error Handling

### API Client Level

Axios interceptor catches and transforms API errors:

```typescript
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data?.error) {
      const apiError = new Error(error.response.data.error.message);
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);
```

### Hook Level

React Query mutations handle errors with notifications:

```typescript
useMutation({
  mutationFn: uploadDocument,
  onError: (error: Error) => {
    addNotification({
      type: 'error',
      message: 'Upload failed',
      description: error.message,
    });
  }
});
```

### Component Level

Components can access error states from hooks:

```typescript
const { error, isError } = useDocuments();

if (isError) {
  return <ErrorBanner message={error.message} />;
}
```

## Caching Strategy

TanStack Query provides intelligent caching:

- **Document List**: 30-second stale time, automatic refetch on window focus
- **Document Detail**: 30-second stale time
- **Classification History**: 60-second stale time (less frequently changing)
- **Mutations**: Automatically invalidate related queries on success

Example cache invalidation:

```typescript
onSuccess: () => {
  // Invalidate document list
  queryClient.invalidateQueries({ queryKey: ['documents'] });
  
  // Invalidate specific document
  queryClient.invalidateQueries({ queryKey: ['documents', documentId] });
}
```

## Polling for Real-Time Updates

Documents with `Pending` status are automatically polled:

```typescript
refetchInterval: (query) => {
  const hasPendingDocs = query.state.data?.items.some(
    (doc) => doc.status === DocumentStatus.Pending
  );
  return hasPendingDocs ? 5000 : false; // Poll every 5 seconds
}
```

## Mock Service Worker (MSW)

For development and testing, MSW intercepts API requests:

Located in `src/tests/mocks/handlers.ts`:

```typescript
export const handlers = [
  http.post('/api/documents/upload', async () => {
    return HttpResponse.json(createMockDocument());
  }),
  
  http.get('/api/documents/:id', ({ params }) => {
    const doc = mockDocuments.find(d => d.id === params.id);
    return HttpResponse.json(doc);
  }),
  
  // ... more handlers
];
```

Enable in development:

```typescript
// src/main.tsx
if (import.meta.env.VITE_MOCK_API === 'true') {
  const { worker } = await import('./tests/mocks/browser');
  worker.start();
}
```

## Environment Configuration

Create `.env.local` file:

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:44347

# Enable MSW mocking (development only)
VITE_MOCK_API=false

# Authentication (if needed)
# VITE_AUTH_CLIENT_ID=your_client_id
```

## Testing API Integration

### Unit Tests with MSW

```typescript
import { render, screen, waitFor } from '@/tests/utils/render';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

test('displays documents from API', async () => {
  render(<DocumentList />);
  
  await waitFor(() => {
    expect(screen.getByText('invoice-001.pdf')).toBeInTheDocument();
  });
});

test('handles API errors', async () => {
  server.use(
    http.get('/api/documents', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );
  
  render(<DocumentList />);
  
  await waitFor(() => {
    expect(screen.getByText('Failed to load documents')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
test('complete upload flow', async () => {
  const user = userEvent.setup();
  render(<DocumentsPage />);
  
  // Upload file
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  const input = screen.getByLabelText('Upload document');
  await user.upload(input, file);
  
  // Wait for upload to complete
  await waitFor(() => {
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
  
  // Verify document appears in list with Pending status
  expect(screen.getByText('Pending')).toBeInTheDocument();
});
```

## Best Practices

1. **Always use hooks for API calls** - Never call `DocumentsApiService` directly from components
2. **Leverage query keys** - Use consistent query key patterns for proper cache invalidation
3. **Handle loading states** - Always show loading indicators during API calls
4. **Display errors gracefully** - Show user-friendly error messages with retry options
5. **Optimize refetch intervals** - Only poll when necessary (e.g., pending documents)
6. **Use optimistic updates** - Update UI immediately for better UX, rollback on error
7. **Type everything** - Ensure all API responses match TypeScript interfaces
8. **Mock in tests** - Use MSW to avoid hitting real API in tests

## Troubleshooting

### CORS Issues

Ensure backend API allows the frontend origin:

```csharp
// Backend: Program.cs
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());
```

### Authentication Errors

Check token storage and expiration:

```typescript
// Check token in localStorage
const token = localStorage.getItem('auth_token');
console.log('Token:', token);

// Verify token in request headers
axios.interceptors.request.use(config => {
  console.log('Request headers:', config.headers);
  return config;
});
```

### Network Errors

Verify API base URL and network connectivity:

```typescript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Test direct fetch
fetch('https://localhost:44347/api/documents')
  .then(res => console.log('Response:', res))
  .catch(err => console.error('Error:', err));
```

## Further Reading

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [MSW Documentation](https://mswjs.io/)
- [Documents API Specification](./documents-api.md)
