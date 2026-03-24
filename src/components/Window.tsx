'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  children: React.ReactNode;
}

const MENUBAR_HEIGHT = 32;

export function Window({
  state,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
  onDrag,
  children,
}: WindowProps) {
  const { onMouseDown } = useDraggable({
    windowId: state.id,
    position: state.position,
    isMaximized: state.isMaximized,
    onDragStart: onFocus,
    onDrag,
  });

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

  return (
    <AnimatePresence>
      <motion.div
        className={`window ${isFocused ? 'window-focused' : ''} ${state.isMaximized ? 'window-maximized' : ''}`}
        style={style}
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onMouseDown={onFocus}
      >
        {/* Title bar */}
        <div className="window-titlebar" onMouseDown={onMouseDown}>
          {/* Traffic lights */}
          <div
            className="window-traffic-lights"
            onMouseDown={(e) => e.stopPropagation()}
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
      </motion.div>
    </AnimatePresence>
  );
}
