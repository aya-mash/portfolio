'use client';

import type { DerivedResumeData } from '@/data';
import { Window } from '@/components/Window';
import { AboutApp } from '@/components/apps/AboutApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import Terminal from '@/components/terminal/Terminal';
import { buildFileSystem } from '@/lib/filesystem';
import { SkillsApp } from '@/components/apps/SkillsApp';
import { ExperienceApp } from '@/components/apps/ExperienceApp';
import { EducationApp } from '@/components/apps/EducationApp';
import { ContactApp } from '@/components/apps/ContactApp';
import { AchievementsApp } from '@/components/apps/AchievementsApp';
import { FileManagerApp } from '@/components/apps/FileManagerApp';
import type { WindowState } from '@/hooks/useWindowManager';

interface WindowManagerProps {
  windows: WindowState[];
  resume: DerivedResumeData;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onRestore: (id: string) => void;
  onFocus: (id: string) => void;
  onDrag: (id: string, position: { x: number; y: number }) => void;
}

function getAppContent(id: string, resume: DerivedResumeData) {
  switch (id) {
    case 'about':
      return <AboutApp resume={resume} />;
    case 'projects':
      return <ProjectsApp projects={resume.select_projects} />;
    case 'terminal':
      return <Terminal data={resume} fs={buildFileSystem(resume)} />;
    case 'skills':
      return <SkillsApp skills={resume.orderedSkillCategories} />;
    case 'experience':
      return <ExperienceApp experience={resume.professional_experience} />;
    case 'education':
      return <EducationApp certs={resume.education_certifications} />;
    case 'contact':
      return <ContactApp info={resume.personal_info} />;
    case 'achievements':
      return <AchievementsApp achievements={resume.key_achievements} />;
    case 'filemanager':
      return <FileManagerApp resume={resume} />;
    default:
      return null;
  }
}

export function WindowManager({
  windows,
  resume,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
  onDrag,
}: WindowManagerProps) {
  /* Determine which window has the highest z-index among visible windows */
  const visibleWindows = windows.filter((w) => w.isOpen && !w.isMinimized);
  const topZIndex = visibleWindows.reduce(
    (max, w) => Math.max(max, w.zIndex),
    0,
  );

  return (
    <>
      {windows.map((win) => (
        <Window
          key={win.id}
          state={win}
          isFocused={win.zIndex === topZIndex && win.isOpen && !win.isMinimized}
          onClose={() => onClose(win.id)}
          onMinimize={() => onMinimize(win.id)}
          onMaximize={() => onMaximize(win.id)}
          onRestore={() => onRestore(win.id)}
          onFocus={() => onFocus(win.id)}
          onDrag={onDrag}
        >
          {getAppContent(win.id, resume)}
        </Window>
      ))}
    </>
  );
}
