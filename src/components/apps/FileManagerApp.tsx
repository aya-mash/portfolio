'use client';

import { useState, useMemo } from 'react';
import type { DerivedResumeData } from '@/data';
import {
  User,
  FolderOpen,
  Briefcase,
  Settings,
  GraduationCap,
  Mail,
  FileText,
  FileCode,
  Link,
  File,
  type LucideIcon,
} from 'lucide-react';

interface FileManagerAppProps {
  resume: DerivedResumeData;
}

type Folder =
  | 'About'
  | 'Projects'
  | 'Experience'
  | 'Skills'
  | 'Education'
  | 'Contact';

interface FileItem {
  name: string;
  meta: string;
  ext: string;
}

const FOLDER_ICONS: Record<Folder, LucideIcon> = {
  About: User,
  Projects: FolderOpen,
  Experience: Briefcase,
  Skills: Settings,
  Education: GraduationCap,
  Contact: Mail,
};

const FILE_EXT_ICONS: Record<string, LucideIcon> = {
  txt: FileText,
  md: FileText,
  proj: FileCode,
  exp: Briefcase,
  skill: Settings,
  cert: GraduationCap,
  lnk: Link,
};

const FOLDERS: Folder[] = [
  'About',
  'Projects',
  'Experience',
  'Skills',
  'Education',
  'Contact',
];

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot >= 0 ? filename.slice(dot + 1) : '';
}

export function FileManagerApp({ resume }: FileManagerAppProps) {
  const [activeFolder, setActiveFolder] = useState<Folder>('About');

  const files: FileItem[] = useMemo(() => {
    switch (activeFolder) {
      case 'About':
        return [
          { name: 'name.txt', meta: resume.personal_info.name, ext: 'txt' },
          { name: 'title.txt', meta: resume.personal_info.title, ext: 'txt' },
          { name: 'location.txt', meta: resume.personal_info.location, ext: 'txt' },
          { name: 'contact.txt', meta: 'Use Contact app to reach out', ext: 'txt' },
          { name: 'summary.md', meta: resume.executive_summary.slice(0, 80) + '...', ext: 'md' },
        ];
      case 'Projects':
        return resume.select_projects.map((p) => ({
          name: `${p.title.replace(/\s+/g, '_')}.proj`,
          meta: `${p.scope} \u00B7 ${p.technologies.length} technologies`,
          ext: 'proj',
        }));
      case 'Experience':
        return resume.professional_experience.map((e) => ({
          name: `${e.company.replace(/\s+/g, '_')}.exp`,
          meta: `${e.role} (${e.start_date} \u2013 ${e.end_date})`,
          ext: 'exp',
        }));
      case 'Skills':
        return resume.orderedSkillCategories.map((cat) => ({
          name: `${cat.category.replace(/\s+/g, '_')}.skill`,
          meta: `${cat.skills.length} skills: ${cat.skills.slice(0, 3).join(', ')}${cat.skills.length > 3 ? '...' : ''}`,
          ext: 'skill',
        }));
      case 'Education':
        return resume.education_certifications.map((cert) => ({
          name: `${cert.degree_cert.replace(/\s+/g, '_')}.cert`,
          meta: `${cert.institution}${cert.year ? ` (${cert.year})` : ''}`,
          ext: 'cert',
        }));
      case 'Contact':
        return [
          { name: 'email.lnk', meta: 'Opens mail client', ext: 'lnk' },
          { name: 'github.lnk', meta: resume.personal_info.github, ext: 'lnk' },
          ...(resume.personal_info.linkedin
            ? [{ name: 'linkedin.lnk', meta: resume.personal_info.linkedin, ext: 'lnk' }]
            : []),
        ];
      default:
        return [];
    }
  }, [activeFolder, resume]);

  const ActiveIcon = FOLDER_ICONS[activeFolder];

  return (
    <div className="filemanager-app">
      {/* Sidebar */}
      <div className="filemanager-sidebar">
        <div className="filemanager-sidebar-title">Favorites</div>
        {FOLDERS.map((folder) => {
          const Icon = FOLDER_ICONS[folder];
          return (
            <button
              key={folder}
              className={`filemanager-folder ${activeFolder === folder ? 'active' : ''}`}
              onClick={() => setActiveFolder(folder)}
            >
              <Icon size={15} className="filemanager-folder-icon" />
              <span>{folder}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="filemanager-content">
        <div className="filemanager-toolbar">
          <ActiveIcon size={16} />
          <span className="filemanager-toolbar-path">{activeFolder}</span>
          <span className="filemanager-toolbar-count">{files.length} items</span>
        </div>

        <div className="filemanager-list">
          <div className="filemanager-list-header">
            <span className="filemanager-col-name">Name</span>
            <span className="filemanager-col-kind">Kind</span>
            <span className="filemanager-col-info">Info</span>
          </div>
          {files.map((file) => {
            const ext = getExtension(file.name);
            const FileIcon = FILE_EXT_ICONS[ext] || File;
            return (
              <div key={file.name} className="filemanager-list-row">
                <span className="filemanager-col-name">
                  <FileIcon size={14} className="filemanager-file-icon" />
                  {file.name}
                </span>
                <span className="filemanager-col-kind">.{ext}</span>
                <span className="filemanager-col-info">{file.meta}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
