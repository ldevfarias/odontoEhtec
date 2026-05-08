'use client';

import React, { useState } from 'react';

interface Sidebar {
  items: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
  }>;
}

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: Sidebar;
  topbar?: React.ReactNode;
  isLoggedIn?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebar,
  topbar,
  isLoggedIn = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      {/* Sidebar */}
      {sidebar && (
        <aside
          style={{
            width: sidebarOpen ? '240px' : '64px',
            background: 'var(--oet-surface-ink)',
            color: 'var(--fg-on-primary)',
            borderRight: '1px solid rgba(255, 252, 245, 0.1)',
            transition: 'width 200ms var(--ease-out)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sidebarOpen ? (
              <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>OET</h1>
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--oet-primary-500)',
                  borderRadius: '8px',
                }}
              />
            )}
          </div>

          {/* Menu items */}
          <nav style={{ flex: 1, padding: '16px 8px' }}>
            {sidebar.items.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                style={{
                  width: '100%',
                  padding: sidebarOpen ? '12px 16px' : '12px',
                  marginBottom: '8px',
                  border: 'none',
                  background: item.active ? 'rgba(217, 168, 108, 0.2)' : 'transparent',
                  color: item.active ? 'var(--oet-accent-500)' : 'rgba(255, 252, 245, 0.7)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 180ms var(--ease-out)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
              >
                {item.icon && <span style={{ fontSize: '18px' }}>{item.icon}</span>}
                {sidebarOpen && item.label}
              </button>
            ))}
          </nav>

          {/* Toggle button */}
          <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255, 252, 245, 0.1)' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                width: '100%',
                padding: '8px',
                border: 'none',
                background: 'transparent',
                color: 'rgba(255, 252, 245, 0.5)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        {topbar && (
          <header
            style={{
              padding: '16px 28px',
              borderBottom: '1px solid var(--oet-border-soft)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {topbar}
          </header>
        )}

        {/* Content area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>{children}</main>
      </div>
    </div>
  );
};
