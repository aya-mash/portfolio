/* ── App Registry — defines every "application" in AyaOS ─────── */

import type { LucideIcon } from 'lucide-react';
import {
  Monitor,
  FolderOpen,
  TerminalSquare,
  Settings,
  Calendar,
  GraduationCap,
  Mail,
  BarChart3,
  Folder,
} from 'lucide-react';

export interface AppDefinition {
  id: string;
  title: string;
  icon: LucideIcon;
  dockLabel: string;
  defaultSize: { width: number; height: number };
  /** Color for the dock icon gradient start */
  color: string;
}

export const APP_REGISTRY: AppDefinition[] = [
  {
    id: 'about',
    title: 'About This Mac',
    icon: Monitor,
    dockLabel: 'About',
    defaultSize: { width: 600, height: 600 },
    color: '#7c3aed',
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: FolderOpen,
    dockLabel: 'Projects',
    defaultSize: { width: 820, height: 600 },
    color: '#3b82f6',
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: TerminalSquare,
    dockLabel: 'Terminal',
    defaultSize: { width: 760, height: 520 },
    color: '#1e1b2e',
  },
  {
    id: 'skills',
    title: 'System Preferences',
    icon: Settings,
    dockLabel: 'Skills',
    defaultSize: { width: 720, height: 560 },
    color: '#6366f1',
  },
  {
    id: 'experience',
    title: 'Timeline',
    icon: Calendar,
    dockLabel: 'Experience',
    defaultSize: { width: 700, height: 600 },
    color: '#8b5cf6',
  },
  {
    id: 'education',
    title: 'Credentials',
    icon: GraduationCap,
    dockLabel: 'Education',
    defaultSize: { width: 660, height: 480 },
    color: '#f59e0b',
  },
  {
    id: 'contact',
    title: 'Mail',
    icon: Mail,
    dockLabel: 'Contact',
    defaultSize: { width: 580, height: 500 },
    color: '#10b981',
  },
  {
    id: 'achievements',
    title: 'Activity Monitor',
    icon: BarChart3,
    dockLabel: 'Achievements',
    defaultSize: { width: 780, height: 520 },
    color: '#ef4444',
  },
  {
    id: 'filemanager',
    title: 'Finder',
    icon: Folder,
    dockLabel: 'Finder',
    defaultSize: { width: 760, height: 520 },
    color: '#0ea5e9',
  },
];

export function getAppById(id: string): AppDefinition | undefined {
  return APP_REGISTRY.find((app) => app.id === id);
}
