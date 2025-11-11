import React from 'react';
import { Link } from 'react-router-dom';
import './PageLayout.css';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="page-layout">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <Link to="/" className="back-button">
          ← Back to Dashboard
        </Link>
      </div>
      <div className="page-content">{children}</div>
    </div>
  );
};

export default PageLayout;
