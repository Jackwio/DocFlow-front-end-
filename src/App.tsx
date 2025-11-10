import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Workflow from './pages/Workflow';
import './App.css';

type Page = 'dashboard' | 'documents' | 'workflow';

function App() {
  const [page, setPage] = React.useState<Page>('dashboard');

  React.useEffect(() => {
    // expose current page to other components (Header/Sidebar) and listen for navigation events
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__docflow_currentPage = page;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Page | undefined;
      if (detail) setPage(detail);
    };

    window.addEventListener('docflow:navigate', handler as EventListener);
    return () => window.removeEventListener('docflow:navigate', handler as EventListener);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'documents':
        return <Documents />;
      case 'workflow':
        return <Workflow />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <div style={{ padding: 12 }}>
        <nav style={{ marginBottom: 12 }}>
          <button
            onClick={() => {
              setPage('dashboard');
              // @ts-ignore
              window.__docflow_currentPage = 'dashboard';
            }}
            style={{ marginRight: 8 }}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setPage('documents');
              // @ts-ignore
              window.__docflow_currentPage = 'documents';
            }}
            style={{ marginRight: 8 }}
          >
            Documents
          </button>
          <button
            onClick={() => {
              setPage('workflow');
              // @ts-ignore
              window.__docflow_currentPage = 'workflow';
            }}
          >
            Workflow
          </button>
        </nav>
        {renderPage()}
      </div>
    </Layout>
  );
}

export default App;
