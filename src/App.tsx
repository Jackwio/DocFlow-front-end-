import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DocumentManagement from './pages/DocumentManagement';
import EasyUpload from './pages/EasyUpload';
import SmartSearch from './pages/SmartSearch';
import StatusTracking from './pages/StatusTracking';
import TenantSettings from './pages/TenantSettings';
import AIFeatures from './pages/AIFeatures';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/documents" element={<DocumentManagement />} />
        <Route path="/upload" element={<EasyUpload />} />
        <Route path="/search" element={<SmartSearch />} />
        <Route path="/status" element={<StatusTracking />} />
        <Route path="/settings" element={<TenantSettings />} />
        <Route path="/ai" element={<AIFeatures />} />
      </Routes>
    </Router>
  );
}

export default App;
