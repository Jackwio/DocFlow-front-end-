# Developer Quickstart Guide

**Feature**: Document Intake + Classification Frontend Interface  
**Last Updated**: 2025-11-10

## Prerequisites

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8.0.0 or higher (`npm install -g pnpm`)
- **Git**: Latest version
- **VS Code**: Recommended with extensions (see [Recommended Extensions](#recommended-extensions))

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Jackwio/DocFlow-front-end-.git
cd doc-flow

# Checkout the feature branch
git checkout 001-doc-intake

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Create `.env.local` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=https://api.docflow.com
VITE_API_TIMEOUT=30000

# Authentication (if applicable)
VITE_AUTH_ENABLED=true

# Feature Flags
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_OFFLINE_MODE=false

# Development
VITE_ENABLE_DEV_TOOLS=true
VITE_MOCK_API=false
```

### 3. Start Development Server

```bash
# Start Vite dev server (with HMR)
pnpm dev

# Server will start at http://localhost:5173
```

### 4. Verify Setup

Open browser to `http://localhost:5173` and verify:
- ✅ Page loads without errors
- ✅ Upload zone is visible
- ✅ No console errors

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives
│   │   ├── Button/
│   │   ├── Badge/
│   │   └── Input/
│   └── documents/       # Domain-specific components
│       ├── UploadZone/
│       ├── DocumentList/
│       └── DocumentDetailPanel/
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── services/            # API client and integrations
│   └── api/
│       ├── client.ts    # Axios instance
│       └── documents.ts # Documents API endpoints
├── state/               # Global UI state (Zustand)
├── styles/              # Design tokens and global styles
│   ├── tokens.ts
│   └── globals.css
├── types/               # Shared TypeScript types
└── utils/               # Utility functions
```

---

## Development Workflow

### Creating a New Component

```bash
# Use the component generator (if available)
pnpm generate:component DocumentUploadProgress ui

# Or create manually:
mkdir -p src/components/ui/DocumentUploadProgress
touch src/components/ui/DocumentUploadProgress/{index.ts,DocumentUploadProgress.tsx,DocumentUploadProgress.test.tsx}
```

**Component Template**:

```typescript
// DocumentUploadProgress.tsx
import React from 'react';

export interface DocumentUploadProgressProps {
  progress: number;          // 0-100
  fileName: string;
  fileSize: number;
  className?: string;
}

export const DocumentUploadProgress: React.FC<DocumentUploadProgressProps> = ({
  progress,
  fileName,
  fileSize,
  className
}) => {
  return (
    <div className={className}>
      <span>{fileName}</span>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
```

**Test Template**:

```typescript
// DocumentUploadProgress.test.tsx
import { render, screen } from '@testing-library/react';
import { DocumentUploadProgress } from './DocumentUploadProgress';

describe('DocumentUploadProgress', () => {
  it('should render file name and progress', () => {
    render(
      <DocumentUploadProgress 
        progress={50} 
        fileName="test.pdf" 
        fileSize={1024} 
      />
    );

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
  });
});
```

### Running Tests

```bash
# Run all tests (unit + integration)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests (Playwright)
pnpm test:e2e

# Run E2E in UI mode (interactive)
pnpm test:e2e:ui
```

### Code Quality Checks

```bash
# Run TypeScript type checking
pnpm type-check

# Run ESLint
pnpm lint

# Auto-fix ESLint issues
pnpm lint:fix

# Run Prettier
pnpm format

# Check formatting
pnpm format:check
```

### Pre-commit Hooks

Husky automatically runs on commit:
1. Lint-staged formats and lints changed files
2. Runs tests related to changed files
3. Blocks commit if checks fail

```bash
# Manual pre-commit check
pnpm pre-commit
```

---

## Working with API

### Mock API for Development

Enable API mocking in `.env.local`:

```env
VITE_MOCK_API=true
```

Mock handlers are in `src/tests/mocks/handlers.ts`:

```typescript
// Add new mock endpoint
export const handlers = [
  http.post('/api/documents/upload', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('File') as File;
    
    return HttpResponse.json<DocumentDto>({
      id: crypto.randomUUID(),
      fileName: file.name,
      fileSize: file.size,
      status: DocumentStatus.Pending,
      uploadedAt: new Date().toISOString(),
      // ... other fields
    });
  })
];
```

### Real API Integration

Update `src/services/api/client.ts` with real API base URL:

```typescript
export const apiClient = createDocumentsApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  getToken: () => localStorage.getItem('auth_token'),
  onUnauthorized: () => {
    // Redirect to login or refresh token
  }
});
```

---

## Testing Strategy

### Unit Tests (Vitest + Testing Library)

Test individual components in isolation:

```typescript
import { render, screen, userEvent } from '@/tests/utils/render';

describe('UploadZone', () => {
  it('should handle file selection', async () => {
    const onFilesSelected = vi.fn();
    const user = userEvent.setup();

    render(<UploadZone onFilesSelected={onFilesSelected} />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/upload/i);

    await user.upload(input, file);

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });
});
```

### Integration Tests

Test multiple components working together:

```typescript
describe('Document Upload Flow', () => {
  it('should upload document and show in list', async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    // Upload file
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/upload/i), file);

    // Verify appears in list
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)

Test complete user journeys:

```typescript
// tests/e2e/upload.spec.ts
import { test, expect } from '@playwright/test';

test('user can upload and classify document', async ({ page }) => {
  await page.goto('/documents');

  // Upload file
  await page.setInputFiles('input[type="file"]', 'fixtures/test.pdf');
  
  // Wait for upload
  await expect(page.getByText('test.pdf')).toBeVisible();
  
  // Verify status badge
  await expect(page.getByText('Pending')).toBeVisible();
  
  // Wait for classification (mock response)
  await expect(page.getByText('Classified')).toBeVisible({ timeout: 10000 });
});
```

---

## Design System Usage

### Using Design Tokens

```typescript
import { colors, spacing, typography } from '@/styles/tokens';

// In TypeScript/JS
const buttonStyle = {
  backgroundColor: colors.status.pending.default,
  padding: `${spacing.md}px ${spacing.lg}px`,
  fontSize: typography.sizes.md
};
```

### Using Tailwind Utilities

```tsx
// Tailwind classes use design tokens
<button className="bg-status-pending text-white px-4 py-2 rounded-md hover:bg-status-pending-dark transition-colors">
  Upload
</button>
```

### Status Badge Colors

```tsx
import { StatusBadge } from '@/components/ui/Badge';

<StatusBadge status={DocumentStatus.Pending} />
// Renders: Light blue background (#E3F2FD), blue text (#2196F3)

<StatusBadge status={DocumentStatus.Classified} />
// Renders: Light green background (#E8F5E9), green text (#4CAF50)

<StatusBadge status={DocumentStatus.Failed} />
// Renders: Light red background (#FFEBEE), red text (#F44336)
```

---

## Common Tasks

### Adding a New API Endpoint

1. **Update API contract** (`specs/001-doc-intake/contracts/documents-api.ts`):

```typescript
export interface IDocumentsApiClient {
  // ... existing methods
  
  /**
   * New endpoint description
   */
  newEndpoint(params: NewParams): Promise<NewResponse>;
}
```

2. **Implement in client** (`src/services/api/documents.ts`):

```typescript
async newEndpoint(params: NewParams): Promise<NewResponse> {
  const response = await this.axiosInstance.post('/api/new-endpoint', params);
  return response.data;
}
```

3. **Create TanStack Query hook** (`src/hooks/useNewFeature.ts`):

```typescript
export const useNewFeature = () => {
  return useMutation({
    mutationFn: (params: NewParams) => apiClient.newEndpoint(params),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });
};
```

4. **Write tests**:

```typescript
describe('useNewFeature', () => {
  it('should call API endpoint', async () => {
    const { result } = renderHook(() => useNewFeature());
    
    await act(async () => {
      await result.current.mutate(testParams);
    });

    expect(mockApiClient.newEndpoint).toHaveBeenCalledWith(testParams);
  });
});
```

### Debugging Tips

**React DevTools**:
```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

**TanStack Query DevTools**:
```typescript
// Already included in development mode
// Access at bottom-right floating button
```

**Vite Inspector**:
```bash
# Click component in browser to jump to source
# Enabled by default in dev mode
```

**Network Debugging**:
```typescript
// Enable Axios logging
import axios from 'axios';

if (import.meta.env.DEV) {
  axios.interceptors.request.use((config) => {
    console.log('→ Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  });

  axios.interceptors.response.use((response) => {
    console.log('← Response:', response.status, response.config.url, response.data);
    return response;
  });
}
```

---

## Recommended Extensions

Install in VS Code for optimal developer experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint integration
    "esbenp.prettier-vscode",           // Prettier formatting
    "bradlc.vscode-tailwindcss",        // Tailwind IntelliSense
    "formulahendry.auto-rename-tag",    // Auto rename HTML tags
    "dsznajder.es7-react-js-snippets",  // React snippets
    "pflannery.vscode-versionlens",     // Package version info
    "usernamehw.errorlens",             // Inline error highlights
    "GitHub.copilot"                    // GitHub Copilot
  ]
}
```

Save as `.vscode/extensions.json` in project root.

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
pnpm dev --port 3000
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors After Pull

```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or rebuild types
pnpm type-check
```

### Test Failures

```bash
# Clear test cache
pnpm test:clear

# Update snapshots (if using snapshot tests)
pnpm test -- -u
```

### Slow HMR

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
pnpm dev
```

---

## Build & Deployment

### Production Build

```bash
# Create optimized production build
pnpm build

# Preview production build locally
pnpm preview
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm build --report

# Opens bundle visualizer in browser
```

### Lighthouse Audit

```bash
# Run Lighthouse CI
pnpm lighthouse

# Or manual audit in Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to "Lighthouse" tab
# 3. Click "Generate report"
```

---

## Resources

- **Feature Spec**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/](./contracts/)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

---

## Getting Help

- **Team Chat**: [Slack channel or Teams]
- **Issue Tracker**: [GitHub Issues](https://github.com/Jackwio/DocFlow-front-end-/issues)
- **Documentation**: [docs/](../../docs/)

---

## Next Steps

After setup, proceed to:

1. ✅ Run tests to verify setup: `pnpm test`
2. ✅ Explore components in `/src/components`
3. ✅ Review API client in `/src/services/api`
4. ✅ Start implementing user stories (see [tasks.md](./tasks.md) when available)

Happy coding! 🚀
