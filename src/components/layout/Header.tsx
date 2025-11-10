import React from 'react';
import './Header.css';

const navigate = (page: 'dashboard' | 'documents' | 'workflow') => {
  // dispatch a simple navigation event for the app to handle
  window.dispatchEvent(new CustomEvent('docflow:navigate', { detail: page }));
  // store current page for components that read it directly
  // @ts-ignore
  window.__docflow_currentPage = page;
};

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('dashboard');
            }}
          >
            <h1>DocFlow</h1>
          </a>
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }}>
            Dashboard
          </a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('documents'); }}>
            Documents
          </a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('workflow'); }}>
            Workflow
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
