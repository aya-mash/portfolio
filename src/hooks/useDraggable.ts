'use client';

import { useCallback, useRef } from 'react';

const MENUBAR_HEIGHT = 32;
const DOCK_AREA = 88;

interface UseDraggableOptions {
  windowId: string;
  position: { x: number; y: number };
  isMaximized: boolean;
  onDragStart?: () => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
}

export function useDraggable({
  windowId,
  position,
  isMaximized,
  onDragStart,
  onDrag,
}: UseDraggableOptions) {
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const clampPosition = useCallback((clientX: number, clientY: number) => {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let newX = clientX - dragOffset.current.x;
    let newY = clientY - dragOffset.current.y;

    newX = Math.max(-200, Math.min(newX, viewportW - 120));
    newY = Math.max(MENUBAR_HEIGHT, Math.min(newY, viewportH - DOCK_AREA));

    return { x: newX, y: newY };
  }, []);

  /* ── Mouse handlers ─────────────────────────────────────────── */

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      onDrag(windowId, clampPosition(e.clientX, e.clientY));
    },
    [windowId, onDrag, clampPosition],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      if (e.button !== 0) return;

      isDragging.current = true;
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      onDragStart?.();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    },
    [isMaximized, position, handleMouseMove, handleMouseUp, onDragStart],
  );

  /* ── Touch handlers ─────────────────────────────────────────── */

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      onDrag(windowId, clampPosition(touch.clientX, touch.clientY));
    },
    [windowId, onDrag, clampPosition],
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isMaximized) return;
      const touch = e.touches[0];

      isDragging.current = true;
      dragOffset.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };

      onDragStart?.();

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    },
    [isMaximized, position, handleTouchMove, handleTouchEnd, onDragStart],
  );

  return { onMouseDown: handleMouseDown, onTouchStart: handleTouchStart };
}
