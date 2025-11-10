import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <h1>DocFlow</h1>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/documents" className="nav-link">Documents</Link>
          <Link to="/workflow" className="nav-link">Workflow</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
