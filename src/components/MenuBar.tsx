'use client';

import { useState, useEffect } from 'react';

interface MenuBarProps {
  name: string;
  title: string;
  activeWindowTitle?: string;
}

export function MenuBar({ name, title, activeWindowTitle }: MenuBarProps) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setClock(
        now.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="menubar">
      <div className="menubar-left">
        <span className="menubar-brand">AyaOS</span>
        {activeWindowTitle && (
          <>
            <span className="menubar-menu-item">{activeWindowTitle}</span>
            <span className="menubar-menu-item">File</span>
            <span className="menubar-menu-item">Edit</span>
            <span className="menubar-menu-item">View</span>
          </>
        )}
      </div>

      <div className="menubar-right">
        <span title={`${name} - ${title}`}>{name}</span>
        <span className="menubar-status-dot" title="Online" />
        <span>{clock}</span>
      </div>
    </header>
  );
}
