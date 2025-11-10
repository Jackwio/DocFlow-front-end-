import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">DocFlow</h1>
        <nav className="header-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/documents" className="nav-link">Documents</a>
          <a href="/upload" className="nav-link">Upload</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
