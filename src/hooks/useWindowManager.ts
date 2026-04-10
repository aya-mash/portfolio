'use client';

import { useState, useCallback, useRef } from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface UseWindowManagerReturn {
  windows: WindowState[];
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  updateSize: (id: string, size: { width: number; height: number }) => void;
  isWindowOpen: (id: string) => boolean;
  getWindow: (id: string) => WindowState | undefined;
}

const MENUBAR_HEIGHT = 32;
const CASCADE_OFFSET = 30;

export function useWindowManager(
  appDefaults: {
    id: string;
    title: string;
    defaultSize: { width: number; height: number };
  }[],
  initialOpenId?: string,
): UseWindowManagerReturn {
  const topZIndexRef = useRef(10);

  const computeInitialPosition = useCallback(
    (index: number, size: { width: number; height: number }) => {
      const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;

      const baseX = Math.max(60, (viewportW - size.width) / 2 - 100);
      const baseY = Math.max(MENUBAR_HEIGHT + 20, (viewportH - size.height) / 2 - 80);

      return {
        x: baseX + (index % 6) * CASCADE_OFFSET,
        y: baseY + (index % 6) * CASCADE_OFFSET,
      };
    },
    [],
  );

  const clampSizeToViewport = useCallback(
    (size: { width: number; height: number }) => {
      const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;

      return {
        width: Math.min(size.width, viewportW - 40),
        height: Math.min(size.height, viewportH - MENUBAR_HEIGHT - 100),
      };
    },
    [],
  );

  const [windows, setWindows] = useState<WindowState[]>(() =>
    appDefaults.map((app, index) => {
      const clampedSize = clampSizeToViewport(app.defaultSize);
      return {
        id: app.id,
        title: app.title,
        isOpen: app.id === initialOpenId,
        isMinimized: false,
        isMaximized: false,
        position: computeInitialPosition(index, clampedSize),
        size: clampedSize,
        zIndex: app.id === initialOpenId ? 11 : 10,
      };
    }),
  );

  const getNextZIndex = useCallback(() => {
    topZIndexRef.current += 1;
    return topZIndexRef.current;
  }, []);

  const openWindow = useCallback(
    (id: string) => {
      const z = getNextZIndex();
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: z }
            : w,
        ),
      );
    },
    [getNextZIndex],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isOpen: false, isMinimized: false, isMaximized: false }
          : w,
      ),
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: true } : w)),
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: false } : w)),
    );
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      const z = getNextZIndex();
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
      );
    },
    [getNextZIndex],
  );

  const updatePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w)),
      );
    },
    [],
  );

  const updateSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, size } : w)),
      );
    },
    [],
  );

  const isWindowOpen = useCallback(
    (id: string) => {
      const w = windows.find((win) => win.id === id);
      return !!w?.isOpen && !w.isMinimized;
    },
    [windows],
  );

  const getWindow = useCallback(
    (id: string) => windows.find((w) => w.id === id),
    [windows],
  );

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updatePosition,
    updateSize,
    isWindowOpen,
    getWindow,
  };
}
