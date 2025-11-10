/**
 * Vitest global setup
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
import.meta.env.VITE_API_BASE_URL = 'http://localhost:3000';
import.meta.env.VITE_MOCK_API = 'true';
