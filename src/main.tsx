/**
 * Application entry point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize MSW in development if mock API is enabled
async function enableMocking() {
  if (import.meta.env.VITE_MOCK_API === 'true') {
    const { worker } = await import('./tests/mocks/browser');
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
