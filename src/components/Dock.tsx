'use client';

import { APP_REGISTRY } from '@/lib/app-registry';

interface DockProps {
  openWindowIds: string[];
  onIconClick: (id: string) => void;
}

export function Dock({ openWindowIds, onIconClick }: DockProps) {
  return (
    <nav className="dock-container" role="toolbar" aria-label="Application dock">
      {APP_REGISTRY.map((app) => {
        const isOpen = openWindowIds.includes(app.id);
        return (
          <div key={app.id} className="dock-icon-wrapper">
            <span className="dock-icon-label">{app.dockLabel}</span>
            <button
              className="dock-icon"
              style={{
                background: `linear-gradient(135deg, ${app.color}, ${app.color}cc)`,
              }}
              onClick={() => onIconClick(app.id)}
              aria-label={`Open ${app.dockLabel}`}
            >
              <app.icon size={24} strokeWidth={1.5} />
            </button>
            {isOpen && <span className="dock-icon-active-dot" />}
          </div>
        );
      })}
    </nav>
  );
}
