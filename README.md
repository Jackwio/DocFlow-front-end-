# DocFlow - Document Intake & Classification Frontend

A modern, accessible React frontend for document intake and automated classification. Built with TypeScript, React 18, Vite, TanStack Query, and Tailwind CSS.

## 🚀 Features

- **Document Upload**: Drag-and-drop interface with real-time progress tracking
- **Real-Time Status Monitoring**: Automatic polling for classification status updates
- **Advanced Search & Filtering**: Search documents with multiple criteria
- **Document Detail View**: Complete classification history and metadata
- **Manual Tag Management**: Add and remove tags manually
- **Batch Operations**: Retry multiple failed classifications at once
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Backend API running at `https://localhost:44347` (or configure via `VITE_API_BASE_URL`)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd doc-flow

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local to configure API endpoint
# VITE_API_BASE_URL=https://localhost:44347
```

## 🏃 Available Scripts

### `npm run dev`

Runs the app in development mode with Vite's fast HMR.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.\
Optimizes the build for best performance with code splitting and minification.

### `npm run preview`

Preview the production build locally.

### `npm test`

Launches Vitest test runner in watch mode.\
Runs all unit and integration tests with coverage reporting.

### `npm run test:unit`

Runs tests once without watch mode (CI mode).

### `npm run test:coverage`

Generates test coverage report.\
Coverage threshold is set to 80% minimum.

### `npm run test:e2e`

Runs Playwright E2E tests across Chrome, Firefox, and Safari.

### `npm run lint`

Runs ESLint to check code quality.\
Auto-fixes minor issues where possible.

### `npm run format`

Formats code with Prettier.\
Automatically applied on pre-commit via Husky.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI primitives (Button, Badge, Input, etc.)
│   └── documents/      # Document-specific components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API client and integrations
│   └── api/           # Documents API client
├── state/             # Global state management (Zustand)
├── styles/            # Design tokens and global styles
├── types/             # TypeScript type definitions
└── utils/             # Utility functions

tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── e2e/              # Playwright E2E tests
```

## 🔌 API Integration

The frontend consumes the Documents API with the following endpoints:

- `POST /api/documents/upload` - Upload single document
- `POST /api/documents/upload-batch` - Upload multiple documents
- `GET /api/documents` - Get paginated document list
- `GET /api/documents/:id` - Get single document details
- `POST /api/documents/search` - Advanced document search
- `POST /api/documents/:id/retry` - Retry failed classification
- `POST /api/documents/:id/tags` - Add manual tag
- `DELETE /api/documents/:id/tags/:tagName` - Remove manual tag
- `GET /api/documents/:id/history` - Get classification history

See [documents-api.md](./documents-api.md) for complete API documentation.

## 🎨 Design System

The application uses a Material Design-inspired light color palette:

- **Primary**: Blue (#2196F3) - Main actions and links
- **Success**: Green (#4CAF50) - Classified documents
- **Warning**: Orange (#FF9800) - Pending/processing
- **Error**: Red (#F44336) - Failed classifications
- **Neutral**: Gray scale - Text and backgrounds

Custom design tokens are defined in `src/styles/tokens.ts` and `tailwind.config.ts`.

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Vitest + Testing Library for components and hooks
- **Integration Tests**: Multi-component user flow testing
- **E2E Tests**: Playwright for critical user journeys
- **Coverage**: 80% minimum threshold enforced in CI

## 🚢 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to your hosting service
```

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes with proper tests
3. Ensure all tests pass: `npm test`
4. Format code: `npm run format`
5. Submit a pull request

## 📄 License

[Your License Here]

## 🔗 Related Documentation

- [API Documentation](./documents-api.md)
- [Feature Specification](./specs/001-doc-intake/spec.md)
- [Implementation Plan](./specs/001-doc-intake/plan.md)
- [Tasks Breakdown](./specs/001-doc-intake/tasks.md)
