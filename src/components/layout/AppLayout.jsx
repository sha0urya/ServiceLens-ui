import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sl-sidebar-collapsed') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('sl-sidebar-collapsed', collapsed);
  }, [collapsed]);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
