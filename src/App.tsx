import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import DocumentList from './components/DocumentList/DocumentList';
import DocumentUpload from './components/DocumentUpload/DocumentUpload';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'documents' | 'upload'>('home');

  // Simple navigation handler
  React.useEffect(() => {
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const href = target.getAttribute('href') || '/';
        if (href === '/') setCurrentPage('home');
        else if (href === '/documents') setCurrentPage('documents');
        else if (href === '/upload') setCurrentPage('upload');
      }
    };

    document.addEventListener('click', handleNavigation);
    return () => document.removeEventListener('click', handleNavigation);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="home-page">
            <div className="welcome-section">
              <h1>Welcome to DocFlow</h1>
              <p>Your comprehensive document management solution</p>
              <div className="feature-cards">
                <div className="feature-card">
                  <h3>📄 Document Management</h3>
                  <p>Organize and manage all your documents in one place</p>
                </div>
                <div className="feature-card">
                  <h3>📤 Easy Upload</h3>
                  <p>Upload documents quickly and securely</p>
                </div>
                <div className="feature-card">
                  <h3>🔍 Smart Search</h3>
                  <p>Find documents easily with powerful search and filters</p>
                </div>
                <div className="feature-card">
                  <h3>✅ Status Tracking</h3>
                  <p>Track document approval status in real-time</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return <DocumentList />;
      case 'upload':
        return <DocumentUpload />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
