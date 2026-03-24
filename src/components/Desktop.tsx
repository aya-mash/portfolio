'use client';

import { useState, useCallback } from 'react';
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

  const handleUnlock = useCallback(() => setLocked(false), []);

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
      } else {
        focusWindow(id);
      }
    } else if (win.isOpen && win.isMinimized) {
      /* Restore from minimize */
      openWindow(id);
    } else {
      openWindow(id);
    }
  };

  const handleDesktopIconDoubleClick = (id: string) => {
    openWindow(id);
    focusWindow(id);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
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

      {/* Desktop icons */}
      <div className="desktop-icons-grid">
        {APP_REGISTRY.map((app) => (
          <div
            key={app.id}
            className="desktop-icon"
            onDoubleClick={() => handleDesktopIconDoubleClick(app.id)}
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
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onRestore={restoreWindow}
        onFocus={focusWindow}
        onDrag={updatePosition}
      />

      {/* Dock */}
      <Dock openWindowIds={openIds} onIconClick={handleDockClick} />
    </div>
  );
}
