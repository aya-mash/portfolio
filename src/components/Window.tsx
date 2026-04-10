'use client';

import { useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useDraggable } from '@/hooks/useDraggable';
import type { WindowState } from '@/hooks/useWindowManager';

interface WindowProps {
  state: WindowState;
  isFocused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onFocus: () => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

const MENUBAR_HEIGHT = 32;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

export function Window({
  state,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
  onDrag,
  onResize,
  children,
}: WindowProps) {
  const prefersReducedMotion = useReducedMotion();
  const resizing = useRef<{ startX: number; startY: number; startW: number; startH: number; edge: string } | null>(null);

  const { onMouseDown, onTouchStart } = useDraggable({
    windowId: state.id,
    position: state.position,
    isMaximized: state.isMaximized,
    onDragStart: onFocus,
    onDrag,
  });

  const handleFocus = useCallback(() => {
    onFocus();
  }, [onFocus]);

  /* ── Resize handlers ─────────────────────────────────────── */
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing.current) return;
      const { startX, startY, startW, startH, edge } = resizing.current;

      let newW = startW;
      let newH = startH;

      if (edge.includes('right') || edge.includes('corner')) {
        newW = Math.max(MIN_WIDTH, startW + (e.clientX - startX));
      }
      if (edge.includes('bottom') || edge.includes('corner')) {
        newH = Math.max(MIN_HEIGHT, startH + (e.clientY - startY));
      }

      onResize(state.id, { width: newW, height: newH });
    },
    [state.id, onResize],
  );

  const handleResizeUp = useCallback(() => {
    resizing.current = null;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleResizeMove]);

  const handleResizeDown = useCallback(
    (edge: string) => (e: React.MouseEvent) => {
      if (state.isMaximized) return;
      e.stopPropagation();
      resizing.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: state.size.width,
        startH: state.size.height,
        edge,
      };

      onFocus();

      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeUp);
      document.body.style.cursor = edge === 'corner' ? 'nwse-resize' : edge === 'right' ? 'ew-resize' : 'ns-resize';
      document.body.style.userSelect = 'none';
    },
    [state.isMaximized, state.size, onFocus, handleResizeMove, handleResizeUp],
  );

  if (!state.isOpen || state.isMinimized) return null;

  const style: React.CSSProperties = state.isMaximized
    ? {
        left: 0,
        top: MENUBAR_HEIGHT,
        width: '100vw',
        height: `calc(100vh - ${MENUBAR_HEIGHT}px - 88px)`,
        zIndex: state.zIndex,
      }
    : {
        left: state.position.x,
        top: state.position.y,
        width: state.size.width,
        height: state.size.height,
        zIndex: state.zIndex,
      };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, damping: 25, stiffness: 300 };

  return (
    <AnimatePresence>
      <motion.div
        className={`window ${isFocused ? 'window-focused' : ''} ${state.isMaximized ? 'window-maximized' : ''}`}
        style={style}
        initial={prefersReducedMotion ? false : { scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0, y: 10 }}
        transition={transition}
        onMouseDown={onFocus}
        onFocus={handleFocus}
        tabIndex={-1}
        role="dialog"
        aria-label={state.title}
      >
        {/* Title bar */}
        <div className="window-titlebar" onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
          {/* Traffic lights */}
          <div
            className="window-traffic-lights"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              className="window-traffic-light close"
              onClick={onClose}
              aria-label="Close"
            >
              &#x2715;
            </button>
            <button
              className="window-traffic-light minimize"
              onClick={onMinimize}
              aria-label="Minimize"
            >
              &#x2013;
            </button>
            <button
              className="window-traffic-light maximize"
              onClick={state.isMaximized ? onRestore : onMaximize}
              aria-label={state.isMaximized ? 'Restore' : 'Maximize'}
            >
              &#x2B1C;
            </button>
          </div>

          {/* Centered title */}
          <span className="window-title">{state.title}</span>

          {/* Spacer to balance traffic lights */}
          <div className="window-title-spacer" />
        </div>

        {/* Body */}
        <div className="window-body">{children}</div>

        {/* Resize handles (hidden on mobile/maximized via CSS) */}
        <div className="window-resize-handle window-resize-handle-right" onMouseDown={handleResizeDown('right')} />
        <div className="window-resize-handle window-resize-handle-bottom" onMouseDown={handleResizeDown('bottom')} />
        <div className="window-resize-handle window-resize-handle-corner" onMouseDown={handleResizeDown('corner')} />
        <div className="window-resize-indicator" />
      </motion.div>
    </AnimatePresence>
  );
}
