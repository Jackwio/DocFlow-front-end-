# Implementation Plan: Document Intake + Classification Frontend Interface

**Branch**: `001-doc-intake` | **Date**: 2025-11-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-doc-intake/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a modern, accessible React frontend interface for document intake and classification with a light, attractive color scheme. The interface enables accounting and legal assistants to upload PDF documents, monitor real-time classification status, search and filter documents, view detailed classification history, and perform batch operations. The design emphasizes visual clarity with Material Design-inspired light colors, smooth animations, responsive layouts (desktop/tablet/mobile), and WCAG 2.1 AA accessibility compliance.

**Technical Approach**: TypeScript + React 18 + Vite for fast development, TanStack Query for server state management, Tailwind CSS for utility-first styling with custom design tokens, React Hook Form + Zod for type-safe form validation, Vitest + Testing Library for unit/integration tests achieving 80% coverage, and Playwright for E2E testing of critical user journeys.

## Technical Context

**Language/Version**: TypeScript 5.3+ with strict mode enabled  
**Primary Dependencies**: 
- React 18.2+ (UI framework)
- Vite 5.0+ (build tool and dev server)
- TanStack Query v5 (server state management, caching, real-time updates)
- Tailwind CSS 3.4+ (utility-first styling)
- React Hook Form 7.x + Zod 3.x (form management and validation)
- Axios 1.6+ (HTTP client with interceptors)

**Storage**: Browser LocalStorage for auth tokens, IndexedDB for offline document queue (future), server-side storage via API  
**Testing**: 
- Vitest 1.x + @testing-library/react (unit and integration tests)
- Playwright 1.40+ (E2E tests for critical paths)
- MSW 2.x (API mocking for tests)
- Coverage target: 80% minimum

**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), responsive support for desktop (≥1024px), tablet (768-1023px), and mobile (<768px)

**Project Type**: Web application (frontend-only, consuming REST API)

**Performance Goals**: 
- Initial page load: <2 seconds on 3G
- Time to Interactive (TTI): <3 seconds
- Document list rendering: 50 items within 100ms
- Search/filter response: <100ms (instant feedback)
- Upload progress updates: Real-time (no lag)
- Lighthouse scores: Performance ≥90, Accessibility ≥90, Best Practices ≥90

**Constraints**: 
- Bundle size: <500KB gzipped for initial load
- UI response time: <50ms for all interactions (hover, click)
- Accessibility: WCAG 2.1 AA compliance mandatory
- Browser support: No IE11, ES2020+ features allowed
- API rate limits: 60 requests/minute per user
- File upload: 50MB max per file

**Scale/Scope**: 
- Expected users: 10-50 concurrent users initially
- Document volume: Up to 100 documents per page, 10,000+ total documents
- 6 major user stories (upload, status monitoring, search, detail view, batch ops, responsive)
- ~15 reusable UI components
- ~10 API integration endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Testing Standards (NON-NEGOTIABLE)

**Status**: COMPLIANT

- [x] **80% Coverage Target**: Plan includes Vitest + Testing Library for unit/integration tests with 80% minimum coverage enforced in CI/CD
- [x] **Test-First Development**: Spec includes comprehensive acceptance scenarios for each user story; tests will be written before implementation
- [x] **Unit Tests**: Every component, hook, utility, and service will have corresponding unit tests
- [x] **Integration Tests**: User flows (upload → status monitoring → search) will be integration tested
- [x] **Coverage Gate**: Vite config will enforce 80% threshold; CI pipeline will fail on coverage drop

**Compliance Notes**: Feature spec provides 24 detailed acceptance scenarios across 6 user stories, enabling test-first approach. Playwright E2E tests will cover critical paths (upload, classification, search).

### ✅ II. User Experience Consistency

**Status**: COMPLIANT

- [x] **Design System**: Spec defines comprehensive light color palette (Material Design-inspired: blues #E3F2FD/#2196F3, greens #E8F5E9/#4CAF50, etc.) with consistent spacing, typography, and interaction patterns
- [x] **Accessibility**: All requirements specify WCAG 2.1 AA compliance (FR-040 to FR-043), keyboard navigation, screen reader support, 4.5:1 contrast ratios
- [x] **Responsive Design**: Spec defines three breakpoints (desktop ≥1024px, tablet 768-1023px, mobile <768px) with adaptive layouts (FR-029 to FR-032)
- [x] **Error Handling**: Clear visual error states defined (light red backgrounds, inline validation, retry buttons with icons)
- [x] **Loading States**: All async operations have loading indicators specified (spinners, skeleton screens, progress bars with 300ms minimum display)

**Compliance Notes**: Design tokens will be centralized in `src/styles/tokens.ts` and Tailwind config. All components will follow consistent patterns defined in spec.

### ✅ III. Component-First Architecture

**Status**: COMPLIANT

- [x] **Reusability**: UI components separated into `/components/ui` (primitives) and `/components/domain` (feature-specific)
- [x] **Single Responsibility**: Spec defines 15+ focused components (UploadZone, StatusBadge, DocumentList, FilterChip, etc.) each with clear purpose
- [x] **Composition**: Complex UIs composed from smaller components (DocumentDetailPanel = Metadata + ClassificationResults + TagList + RoutingTimeline)
- [x] **Isolation**: Each component independently testable with Testing Library
- [x] **Prop Validation**: TypeScript strict mode enforces strong typing; all component props will use TypeScript interfaces

**Compliance Notes**: Project structure includes `/src/components/ui` for reusable primitives and `/src/components/documents` for domain-specific document management components.

### ✅ IV. Type Safety & Quality Gates

**Status**: COMPLIANT

- [x] **Strict Mode**: TypeScript strict mode enabled in tsconfig.json
- [x] **No Implicit Any**: ESLint rule `@typescript-eslint/no-explicit-any` enforced
- [x] **Interface Definitions**: All API contracts (DocumentDto, StatusBadge props, etc.) will have TypeScript interfaces; Zod schemas for runtime validation
- [x] **Linting**: ESLint + TypeScript ESLint plugin configured; CI enforces zero errors/warnings
- [x] **Pre-commit Hooks**: Husky + lint-staged for pre-commit formatting (Prettier) and linting

**Compliance Notes**: API response types will be generated from documents-api.md contracts. Zod schemas will provide runtime type safety for API responses and form inputs.

### Constitution Compliance Summary

**Overall Status**: ✅ ALL GATES PASSED

All four core principles are satisfied by the technical approach and feature specification. No violations require justification. The project is approved to proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-doc-intake/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - Technology decisions and best practices
├── data-model.md        # Phase 1 output - TypeScript interfaces and data structures
├── quickstart.md        # Phase 1 output - Developer setup and workflow guide
├── contracts/           # Phase 1 output - API integration contracts
│   ├── documents-api.ts # TypeScript types generated from documents-api.md
│   └── api-client.ts    # Axios client configuration and endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ui/                          # Reusable UI primitives (Constitution III)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Badge/                   # StatusBadge, TagBadge
│   │   ├── Input/                   # SearchInput, TextInput
│   │   ├── Modal/                   # Confirmation modals
│   │   ├── ProgressBar/
│   │   ├── Skeleton/                # Loading placeholders
│   │   ├── Chip/                    # FilterChip
│   │   └── Toast/                   # Notifications
│   └── documents/                   # Domain-specific components
│       ├── UploadZone/
│       │   ├── UploadZone.tsx
│       │   ├── UploadZone.test.tsx
│       │   └── useFileUpload.ts     # Custom hook
│       ├── DocumentList/
│       │   ├── DocumentList.tsx
│       │   ├── DocumentListItem.tsx
│       │   └── DocumentList.test.tsx
│       ├── DocumentDetailPanel/
│       │   ├── DocumentDetailPanel.tsx
│       │   ├── MetadataSection.tsx
│       │   ├── ClassificationResults.tsx
│       │   ├── TagList.tsx
│       │   └── RoutingTimeline.tsx
│       ├── SearchBar/
│       ├── FilterPanel/
│       └── BatchActionBar/
├── pages/                           # Route components
│   ├── DocumentsPage.tsx            # Main documents list view
│   └── DocumentsPage.test.tsx
├── hooks/                           # Custom React hooks
│   ├── useDocuments.ts              # TanStack Query hook for document list
│   ├── useDocumentDetail.ts         # Single document query
│   ├── useDocumentUpload.ts         # Upload mutation
│   ├── useDocumentSearch.ts         # Search/filter logic
│   ├── usePolling.ts                # Status polling for pending documents
│   └── useMediaQuery.ts             # Responsive breakpoint detection
├── services/                        # API client and external integrations
│   ├── api/
│   │   ├── client.ts                # Axios instance with interceptors
│   │   ├── documents.ts             # Document API endpoints
│   │   ├── auth.ts                  # Token management
│   │   └── types.ts                 # API response types (from contracts/)
│   └── storage/
│       └── localStorage.ts          # Token persistence
├── state/                           # Global UI state (minimal)
│   └── useUIStore.ts                # Zustand store for theme, modals, notifications
├── utils/                           # Pure utility functions
│   ├── formatting.ts                # Date, file size formatters
│   ├── validation.ts                # Zod schemas
│   └── constants.ts                 # Magic numbers, enums
├── styles/                          # Design system
│   ├── tokens.ts                    # Design tokens (colors, spacing, typography)
│   ├── globals.css                  # Base styles, Tailwind directives
│   └── animations.ts                # Framer Motion variants
├── types/                           # Shared TypeScript types
│   ├── document.ts                  # Document domain types
│   ├── ui.ts                        # UI component prop types
│   └── api.ts                       # Re-exports from services/api/types
└── tests/                           # Test utilities
    ├── setup.ts                     # Vitest setup
    ├── mocks/
    │   ├── handlers.ts              # MSW request handlers
    │   └── data.ts                  # Mock document data
    └── utils/
        ├── render.tsx               # Custom render with providers
        └── factories.ts             # Test data builders

tests/                               # Test files (mirror src/ structure)
├── unit/                            # Component and utility tests
│   ├── components/
│   └── utils/
├── integration/                     # Multi-component flow tests
│   ├── upload-flow.test.tsx
│   ├── search-filter.test.tsx
│   └── document-detail.test.tsx
└── e2e/                             # Playwright E2E tests
    ├── upload.spec.ts
    ├── classification-monitoring.spec.ts
    └── search.spec.ts

public/
├── index.html
├── favicon.ico
└── assets/
    └── icons/                       # SVG icons for file types, statuses

Config files (repository root):
├── vite.config.ts                   # Vite build config, aliases
├── vitest.config.ts                 # Test configuration
├── playwright.config.ts             # E2E test configuration
├── tailwind.config.ts               # Tailwind + design tokens
├── tsconfig.json                    # TypeScript strict mode
├── .eslintrc.cjs                    # ESLint + TypeScript rules
├── .prettierrc                      # Code formatting
├── .husky/                          # Git hooks
│   └── pre-commit                   # Run lint-staged
└── package.json
```

**Structure Decision**: Web application (frontend-only) structure selected. This is a single-page application consuming the Documents API (REST). The structure follows Component-First Architecture (Constitution III) with clear separation between reusable UI primitives (`/components/ui`) and domain-specific document components (`/components/documents`). TanStack Query hooks in `/hooks` manage server state, while `/services/api` encapsulates all HTTP communication. Tests mirror source structure for discoverability.

## Complexity Tracking

No constitution violations. This section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
