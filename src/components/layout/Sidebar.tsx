import React from 'react';
import './Sidebar.css';

const navigate = (page: 'dashboard' | 'documents' | 'workflow') => {
  window.dispatchEvent(new CustomEvent('docflow:navigate', { detail: page }));
  // @ts-ignore
  window.__docflow_currentPage = page;
};

const Sidebar: React.FC = () => {
  const [current, setCurrent] = React.useState<string>(() => {
    // @ts-ignore
    return window.__docflow_currentPage || 'dashboard';
  });

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | undefined;
      if (detail) setCurrent(detail);
    };
    window.addEventListener('docflow:navigate', handler as EventListener);
    return () => window.removeEventListener('docflow:navigate', handler as EventListener);
  }, []);

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'documents', label: 'Documents', icon: '📄' },
    { key: 'workflow', label: 'Workflow', icon: '🔄' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a
            key={item.key}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(item.key as 'dashboard' | 'documents' | 'workflow');
            }}
            className={`sidebar-link ${current === item.key ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
