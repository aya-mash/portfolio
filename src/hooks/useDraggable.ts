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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      /* Constrain within viewport: not behind menu bar, not below dock */
      newX = Math.max(-200, Math.min(newX, viewportW - 120));
      newY = Math.max(MENUBAR_HEIGHT, Math.min(newY, viewportH - DOCK_AREA));

      onDrag(windowId, { x: newX, y: newY });
    },
    [windowId, onDrag],
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
      /* Only drag on left click */
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

  return { onMouseDown: handleMouseDown };
}
