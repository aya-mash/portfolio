'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { DerivedResumeData } from '@/data';
import { useWindowManager } from '@/hooks/useWindowManager';
import { APP_REGISTRY } from '@/lib/app-registry';
import { MenuBar } from '@/components/MenuBar';
import { Dock } from '@/components/Dock';
import { WindowManager } from '@/components/WindowManager';
import { LockScreen } from '@/components/LockScreen';
import WallpaperScene from '@/components/WallpaperScene';

interface DesktopProps {
  resume: DerivedResumeData;
}

export function Desktop({ resume }: DesktopProps) {
  const [locked, setLocked] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const announcementTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleUnlock = useCallback(() => setLocked(false), []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    clearTimeout(announcementTimeout.current);
    announcementTimeout.current = setTimeout(() => setAnnouncement(''), 3000);
  }, []);

  useEffect(() => {
    return () => clearTimeout(announcementTimeout.current);
  }, []);

  const appDefaults = APP_REGISTRY.map((app) => ({
    id: app.id,
    title: app.title,
    defaultSize: app.defaultSize,
  }));

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updatePosition,
    updateSize,
  } = useWindowManager(appDefaults, 'about');

  /* Determine the focused (top) window's title for the menu bar */
  const visibleWindows = windows.filter((w) => w.isOpen && !w.isMinimized);
  const topWindow = visibleWindows.reduce<(typeof windows)[0] | null>(
    (top, w) => (!top || w.zIndex > top.zIndex ? w : top),
    null,
  );

  /* IDs of windows that are currently open (for dock indicators) */
  const openIds = windows.filter((w) => w.isOpen).map((w) => w.id);

  const handleDockClick = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isOpen && !win.isMinimized) {
      /* If it is already visible and focused, minimize it; otherwise, focus it */
      const isFocused = win.zIndex === topWindow?.zIndex;
      if (isFocused) {
        minimizeWindow(id);
        announce(`${win.title} minimized`);
      } else {
        focusWindow(id);
        announce(`${win.title} focused`);
      }
    } else if (win.isOpen && win.isMinimized) {
      /* Restore from minimize */
      openWindow(id);
      announce(`${win.title} restored`);
    } else {
      openWindow(id);
      announce(`${win.title} opened`);
    }
  };

  const handleDesktopIconOpen = (id: string) => {
    openWindow(id);
    focusWindow(id);
    const app = APP_REGISTRY.find((a) => a.id === id);
    if (app) announce(`${app.title} opened`);
  };

  const handleDesktopIconKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDesktopIconOpen(id);
    }
  };

  const handleClose = (id: string) => {
    closeWindow(id);
    const win = windows.find((w) => w.id === id);
    if (win) announce(`${win.title} closed`);
  };

  const handleMinimize = (id: string) => {
    minimizeWindow(id);
    const win = windows.find((w) => w.id === id);
    if (win) announce(`${win.title} minimized`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Skip navigation */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* 3D Wallpaper */}
      <WallpaperScene />

      {/* Lock Screen */}
      {locked && (
        <LockScreen
          name={resume.personal_info.name}
          title={resume.personal_info.title}
          onUnlock={handleUnlock}
        />
      )}

      {/* Menu bar */}
      <MenuBar
        name={resume.personal_info.preferred_name}
        title={resume.personal_info.title}
        activeWindowTitle={topWindow?.title}
      />

      {/* Main content area */}
      <main id="main-content">
        <h1 className="sr-only">Ayabulela Mahlathini — Software Engineer Portfolio</h1>

        {/* Desktop icons */}
        <div className="desktop-icons-grid" role="list" aria-label="Desktop applications">
          {APP_REGISTRY.map((app) => (
            <div
              key={app.id}
              className="desktop-icon"
              role="listitem"
              tabIndex={0}
              aria-label={`Open ${app.dockLabel}`}
              onDoubleClick={() => handleDesktopIconOpen(app.id)}
              onKeyDown={(e) => handleDesktopIconKeyDown(e, app.id)}
            >
              <div className="desktop-icon-image"><app.icon size={32} strokeWidth={1.5} /></div>
              <span className="desktop-icon-label">{app.dockLabel}</span>
            </div>
          ))}
        </div>

        {/* All windows */}
        <WindowManager
          windows={windows}
          resume={resume}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={maximizeWindow}
          onRestore={restoreWindow}
          onFocus={focusWindow}
          onDrag={updatePosition}
          onResize={updateSize}
        />
      </main>

      {/* Dock */}
      <Dock openWindowIds={openIds} onIconClick={handleDockClick} />

      {/* Live region for screen reader announcements */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
