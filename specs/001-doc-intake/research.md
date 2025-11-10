# Phase 0: Research & Technology Decisions

**Feature**: Document Intake + Classification Frontend Interface  
**Date**: 2025-11-10  
**Status**: Complete

## Overview

This document captures research findings and technology decisions for implementing the Document Intake + Classification frontend interface. All decisions align with the TypeScript + React best practices provided by the user and the DocFlow Constitution principles.

---

## 1. Build Tool & Development Server

### Decision: Vite 5.0+

**Rationale**:
- **Fast HMR**: Vite's native ESM-based dev server provides instant hot module replacement (<50ms), critical for rapid UI iteration
- **Optimized Builds**: Rollup-based production builds with automatic code splitting and tree-shaking
- **TypeScript First-Class**: Native TypeScript support without additional configuration
- **Plugin Ecosystem**: Rich plugin ecosystem for PWA, compression, bundle analysis
- **Developer Experience**: Instant server start, fast rebuilds, excellent error reporting

**Alternatives Considered**:
- **Create React App**: Deprecated and slower build times; not recommended for new projects
- **Next.js**: Overkill for SPA; adds SSR complexity not needed for authenticated internal tool
- **Webpack**: Slower HMR and more complex configuration compared to Vite

**Implementation Notes**:
- Use `vite-plugin-pwa` for future offline support
- Configure path aliases (`@/components`, `@/hooks`, etc.) for clean imports
- Set up bundle size analyzer to enforce <500KB gzipped constraint

---

## 2. State Management Strategy

### Decision: TanStack Query v5 + Zustand (minimal)

**Rationale**:

**TanStack Query for Server State**:
- **Automatic Caching**: Reduces API calls; documents fetched once and cached intelligently
- **Real-Time Updates**: Built-in polling and refetch strategies for status monitoring (Pending → Classified)
- **Optimistic Updates**: Instant UI feedback for uploads/tag additions before server confirmation
- **Error Handling**: Centralized retry logic, exponential backoff, error boundaries
- **DevTools**: Excellent debugging tools for cache inspection

**Zustand for UI State**:
- **Minimal Boilerplate**: Simple API for theme, modal visibility, notification queue
- **No Provider Hell**: Direct store access without context providers
- **TypeScript-Friendly**: Full type inference out of the box
- **Lightweight**: <1KB bundle size

**Alternatives Considered**:
- **Redux Toolkit**: Too heavy for this use case; TanStack Query eliminates most state management needs
- **Recoil**: More complex API; overkill when server state is primary concern
- **Context + Reducer**: Verbose for complex async state; no caching or retry logic

**Implementation Notes**:
```typescript
// TanStack Query for server state
const { data: documents } = useDocuments({ status: 'Pending' });
const uploadMutation = useDocumentUpload();

// Zustand for UI state
const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  notifications: [],
  addNotification: (notification) => set((state) => ({ 
    notifications: [...state.notifications, notification] 
  }))
}));
```

---

## 3. Styling Solution

### Decision: Tailwind CSS 3.4+ with Custom Design Tokens

**Rationale**:
- **Utility-First**: Rapid prototyping of light color scheme components without leaving JSX
- **Design Tokens**: Easy integration of spec's color palette (blues, greens, reds) via `tailwind.config.ts`
- **Responsive Design**: Built-in breakpoint system matches spec requirements (sm, md, lg)
- **Tree-Shaking**: Only used utilities included in production bundle
- **Consistent Spacing**: Enforces design system with standardized spacing scale
- **Dark Mode Ready**: Future-proof with `dark:` variants when needed

**Alternatives Considered**:
- **Emotion/Styled-Components**: Runtime CSS-in-JS adds bundle size and performance overhead
- **CSS Modules**: More boilerplate; harder to maintain design token consistency
- **Plain CSS**: No constraint system; prone to inconsistency and duplication

**Implementation Notes**:
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        status: {
          pending: { light: '#E3F2FD', DEFAULT: '#2196F3' },
          classified: { light: '#E8F5E9', DEFAULT: '#4CAF50' },
          failed: { light: '#FFEBEE', DEFAULT: '#F44336' },
          routed: { light: '#F3E5F5', DEFAULT: '#9C27B0' }
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  }
}
```

---

## 4. Form Management & Validation

### Decision: React Hook Form 7.x + Zod 3.x

**Rationale**:
- **Type-Safe Validation**: Zod schemas provide runtime validation + TypeScript type inference
- **Performance**: Uncontrolled components minimize re-renders during typing
- **DevX**: Clean API with minimal boilerplate
- **Error Handling**: Automatic error state management with customizable display
- **Integration**: Seamless integration with TanStack Query mutations

**Alternatives Considered**:
- **Formik**: More re-renders; slower performance on complex forms
- **Manual State**: Verbose; error-prone; no built-in validation

**Implementation Notes**:
```typescript
const uploadSchema = z.object({
  file: z.instanceof(File).refine((f) => f.size <= 50 * 1024 * 1024, {
    message: "File must be under 50MB"
  }),
  fileName: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional()
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(uploadSchema)
});
```

---

## 5. HTTP Client & API Integration

### Decision: Axios 1.6+ with Interceptors

**Rationale**:
- **Interceptors**: Centralized auth token injection, error handling, retry logic
- **Request/Response Transform**: Automatic JSON parsing, date deserialization
- **TypeScript Support**: Full typing for request/response with generics
- **Cancellation**: Built-in request cancellation for pending requests on unmount
- **Progress Events**: Native upload progress tracking for FR-002 requirement

**Alternatives Considered**:
- **Fetch API**: No interceptors; requires manual retry/auth logic
- **tRPC**: Backend not TypeScript; overkill for REST API

**Implementation Notes**:
```typescript
// services/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

## 6. Testing Strategy

### Decision: Vitest + Testing Library + Playwright

**Rationale**:

**Vitest for Unit/Integration Tests**:
- **Vite-Native**: Shares Vite config; instant test execution with HMR
- **Jest-Compatible API**: Easy migration knowledge; familiar assertions
- **Fast Execution**: 10x faster than Jest for large test suites
- **Built-in Coverage**: Istanbul/v8 coverage with zero config
- **Watch Mode**: Intelligent test re-runs on file changes

**Testing Library for Component Tests**:
- **User-Centric**: Query by role/label (accessibility-first), not implementation details
- **Encourages Best Practices**: Forces accessible markup (Constitution II)
- **Integration-Friendly**: Test components in isolation or with providers
- **Constitution I Compliance**: Enables 80% coverage target with maintainable tests

**Playwright for E2E Tests**:
- **Multi-Browser**: Test Chrome, Firefox, Safari simultaneously
- **Auto-Wait**: Smart waiting eliminates flaky tests
- **Trace Viewer**: Visual debugging of test failures
- **Parallel Execution**: Fast CI runs

**Alternatives Considered**:
- **Jest**: Slower startup and execution compared to Vitest
- **Cypress**: More overhead; Playwright has better TypeScript support and parallel execution

**Implementation Notes**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      exclude: ['**/*.test.tsx', '**/tests/**', '**/mocks/**']
    }
  }
});
```

---

## 7. API Mocking for Tests

### Decision: MSW (Mock Service Worker) 2.x

**Rationale**:
- **Network-Level Mocking**: Intercepts actual HTTP requests; works with any library (Axios, Fetch)
- **Reusable Handlers**: Same mock definitions for Vitest and Playwright tests
- **Realistic Testing**: Test actual network errors, delays, race conditions
- **DevX**: Can enable in browser for frontend-only development
- **Type-Safe**: TypeScript support for request/response typing

**Alternatives Considered**:
- **Axios Mocking**: Tightly coupled to HTTP library; brittle
- **Jest Manual Mocks**: Doesn't test actual network layer; misses integration issues

**Implementation Notes**:
```typescript
// tests/mocks/handlers.ts
export const handlers = [
  http.get('/api/documents', () => {
    return HttpResponse.json<PagedResultDto<DocumentListDto>>({
      totalCount: 150,
      items: mockDocuments
    });
  }),
  http.post('/api/documents/upload', async ({ request }) => {
    const formData = await request.formData();
    return HttpResponse.json<DocumentDto>(mockUploadedDocument);
  })
];
```

---

## 8. Design Tokens & Theme System

### Decision: Tailwind Config + CSS Custom Properties

**Rationale**:
- **Centralized Tokens**: Single source of truth for colors, spacing, typography
- **Tailwind Integration**: Tokens available as utility classes (`bg-status-pending-light`)
- **Runtime Switching**: CSS variables enable dynamic theme changes (future dark mode)
- **Type Safety**: Export tokens as TypeScript constants for JS usage
- **Inspector-Friendly**: CSS variables visible in browser DevTools

**Alternatives Considered**:
- **JS-Only Tokens**: Not accessible to plain CSS; harder to debug
- **Hardcoded Values**: Inconsistency risk; maintenance nightmare

**Implementation Notes**:
```typescript
// styles/tokens.ts
export const colors = {
  status: {
    pending: { light: '#E3F2FD', default: '#2196F3' },
    classified: { light: '#E8F5E9', default: '#4CAF50' },
    failed: { light: '#FFEBEE', default: '#F44336' },
    routed: { light: '#F3E5F5', default: '#9C27B0' }
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E0E0E0',
    // ...
  }
} as const;

// globals.css
:root {
  --color-status-pending-light: 227 242 253; /* RGB for Tailwind */
  --color-status-pending: 33 150 243;
  /* ... */
}
```

---

## 9. Animation & Motion

### Decision: CSS Transitions + Framer Motion (selective)

**Rationale**:
- **CSS First**: Simple transitions (hover, focus) use pure CSS for performance
- **Framer Motion for Complex**: Slide-in panels, staggered lists, drag-and-drop use Framer Motion
- **Spring Physics**: Natural-feeling animations align with Material Design principles
- **Accessibility**: Respects `prefers-reduced-motion` automatically
- **Declarative**: Animation variants keep code clean

**Alternatives Considered**:
- **React Spring**: More complex API; Framer Motion is more React-idiomatic
- **Pure CSS**: Insufficient for complex sequences (stagger, orchestration)

**Implementation Notes**:
```typescript
// Tailwind config for simple transitions
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: '300ms'
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  }
};

// Framer Motion for complex animations
const slideInVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
};
```

---

## 10. Accessibility Implementation

### Decision: Radix UI Primitives + Manual ARIA

**Rationale**:
- **Radix Primitives**: Unstyled, accessible components (Modal, Dropdown, Tooltip) with built-in ARIA
- **Keyboard Navigation**: Focus management, escape handling out-of-the-box
- **Screen Reader Testing**: Test with NVDA (Windows), VoiceOver (Mac)
- **axe DevTools**: Automated accessibility audits during development
- **Constitution II Compliance**: Ensures WCAG 2.1 AA compliance (FR-040 to FR-043)

**Alternatives Considered**:
- **Headless UI**: Less comprehensive than Radix; fewer primitives
- **Material-UI**: Too opinionated; heavy bundle size; harder to customize for light theme

**Implementation Notes**:
```typescript
// Button component with accessibility
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  isLoading?: boolean;
  'aria-label'?: string;
}

export const Button = ({ variant = 'primary', isLoading, children, ...props }: ButtonProps) => (
  <button
    className={cn(buttonVariants[variant])}
    aria-busy={isLoading}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading ? <Spinner aria-hidden="true" /> : null}
    {children}
  </button>
);
```

---

## 11. Performance Optimization Strategy

### Decision: Code Splitting + React.lazy + Image Optimization

**Rationale**:
- **Route-Based Splitting**: Main page loads first; detail panel lazy-loaded
- **Component-Level Splitting**: Heavy components (Markdown renderer, charts) loaded on demand
- **Bundle Analysis**: vite-plugin-visualizer to identify large dependencies
- **Lighthouse CI**: Automated performance regression detection
- **Constitution Performance Standards**: Meets <2s load time, <3s TTI requirements

**Alternatives Considered**:
- **Manual Chunking**: Less maintainable than automatic splitting
- **No Optimization**: Risk failing Constitution performance gates

**Implementation Notes**:
```typescript
// Lazy load detail panel (not needed on initial page load)
const DocumentDetailPanel = lazy(() => import('@/components/documents/DocumentDetailPanel'));

// Route-based splitting
const routes = [
  {
    path: '/documents',
    component: lazy(() => import('@/pages/DocumentsPage'))
  }
];

// Image optimization
<img 
  src={`${import.meta.env.VITE_CDN_URL}/icons/${fileType}.svg`}
  loading="lazy"
  alt={`${fileType} file icon`}
/>
```

---

## 12. Real-Time Status Updates

### Decision: TanStack Query Polling + WebSocket (future)

**Rationale**:
- **Phase 1 (MVP)**: TanStack Query's `refetchInterval` polls every 5 seconds for pending documents
- **Selective Polling**: Only poll when documents in Pending/Processing state exist
- **Background Refetch**: Continue polling in background tabs (configurable)
- **Phase 2 (Future)**: Migrate to WebSocket for true push updates when API supports it

**Alternatives Considered**:
- **Long Polling**: Higher server load than interval polling
- **SSE (Server-Sent Events)**: API doesn't support it yet
- **WebSocket Immediately**: Premature; API spec shows polling is sufficient for MVP

**Implementation Notes**:
```typescript
// hooks/useDocuments.ts
export const useDocuments = (filters: DocumentFilters) => {
  const hasPendingDocs = /* check if any pending docs exist */;
  
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => documentsApi.getDocumentList(filters),
    refetchInterval: hasPendingDocs ? 5000 : false, // Poll only when needed
    refetchIntervalInBackground: true
  });
};
```

---

## 13. Error Handling & User Feedback

### Decision: React Error Boundaries + Toast Notifications + Inline Errors

**Rationale**:
- **Error Boundaries**: Catch component crashes; show fallback UI (Constitution II)
- **Toast Notifications**: Non-blocking feedback for success/error actions (auto-dismiss after 3s)
- **Inline Errors**: Form validation errors appear next to fields (FR-039)
- **Sentry Integration**: Error tracking for production issues (future)

**Alternatives Considered**:
- **Modal Errors**: Too disruptive for non-critical errors
- **Console-Only**: Poor UX; users won't see errors

**Implementation Notes**:
```typescript
// Error boundary wrapper
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => console.error(error, errorInfo)}
>
  <DocumentsPage />
</ErrorBoundary>

// Toast notifications from Zustand store
const addNotification = useUIStore((state) => state.addNotification);

uploadMutation.mutate(file, {
  onSuccess: () => addNotification({ 
    type: 'success', 
    message: 'Document uploaded successfully' 
  }),
  onError: (error) => addNotification({ 
    type: 'error', 
    message: error.message 
  })
});
```

---

## 14. Internationalization (i18n) - Future Consideration

### Decision: Defer to Post-MVP

**Rationale**:
- **Current Scope**: English-only for accounting/legal assistants (specified users)
- **Future-Proof**: Design component architecture to accept i18n keys later
- **Library Choice**: react-i18next (when needed)

**Implementation Notes**:
- Use string constants in `src/utils/constants.ts` for easy extraction later
- Avoid hardcoded strings in components; use named constants

---

## 15. Development Workflow Tools

### Decision: ESLint + Prettier + Husky + Lint-Staged

**Rationale**:
- **ESLint**: Enforce TypeScript best practices, no `any`, import ordering (Constitution IV)
- **Prettier**: Consistent code formatting across team
- **Husky**: Git hooks for pre-commit quality checks
- **Lint-Staged**: Only lint changed files (fast commits)
- **Constitution IV Compliance**: Pre-commit hooks enforce quality gates

**Implementation Notes**:
```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged

// package.json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "vitest related --run"
  ]
}
```

---

## Research Summary

All technical decisions documented and justified. Key technologies selected:

**Core Stack**:
- TypeScript 5.3+ (strict mode)
- React 18.2+
- Vite 5.0+
- TanStack Query v5
- Tailwind CSS 3.4+
- Vitest + Testing Library + Playwright

**Quality & DevX**:
- Zod (validation)
- React Hook Form (forms)
- MSW (API mocking)
- Radix UI (accessibility primitives)
- Framer Motion (animations)
- Husky + Lint-Staged (quality gates)

**Constitution Compliance**: All decisions align with Testing Standards (I), UX Consistency (II), Component-First Architecture (III), and Type Safety (IV).

**Next Steps**: Proceed to Phase 1 (Design & Contracts) - create data-model.md, API contracts, and quickstart.md.
