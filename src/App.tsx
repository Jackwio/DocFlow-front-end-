import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Workflow from './pages/Workflow';
import DocumentManagement from './pages/DocumentManagement';
import EasyUpload from './pages/EasyUpload';
import SmartSearch from './pages/SmartSearch';
import StatusTracking from './pages/StatusTracking';
import './App.css';

type Page = 'dashboard' | 'documents' | 'workflow' | 'document-management' | 'easy-upload' | 'smart-search' | 'status-tracking';

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
      case 'document-management':
        return <DocumentManagement />;
      case 'easy-upload':
        return <EasyUpload />;
      case 'smart-search':
        return <SmartSearch />;
      case 'status-tracking':
        return <StatusTracking />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default App;
