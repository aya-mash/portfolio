/* ──────────────────────────────────────────────────────────────────
 * filesystem.ts — Virtual filesystem built from resume data
 *
 * Maps DerivedResumeData into a tree of virtual directories and
 * files that the terminal can ls, cd, and cat.
 * ────────────────────────────────────────────────────────────────── */

import type { DerivedResumeData } from '@/data';

/* ── Types ─────────────────────────────────────────────────────── */

export interface FSFile {
  type: 'file';
  name: string;
  content: string;
}

export interface FSDirectory {
  type: 'directory';
  name: string;
  children: Record<string, FSNode>;
}

export type FSNode = FSFile | FSDirectory;

/* ── Slugify helper ────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* ── Build the filesystem from resume data ─────────────────────── */

export function buildFileSystem(data: DerivedResumeData): FSDirectory {
  const root: FSDirectory = {
    type: 'directory',
    name: '~',
    children: {},
  };

  const home: FSDirectory = {
    type: 'directory',
    name: 'aya',
    children: {},
  };

  root.children['aya'] = home;

  // ── about.txt ───────────────────────────────────────────────
  home.children['about.txt'] = {
    type: 'file',
    name: 'about.txt',
    content: [
      `# ${data.personal_info.name}`,
      `# ${data.personal_info.title}`,
      '',
      data.executive_summary,
      '',
      '## Key Achievements',
      '',
      ...data.key_achievements.map(
        (a) => `  * ${a.heading}: ${a.description}`,
      ),
    ].join('\n'),
  };

  // ── contact.txt ─────────────────────────────────────────────
  const contactLines = [
    `Name:     ${data.personal_info.name}`,
    `Title:    ${data.personal_info.title}`,
    `Location: ${data.personal_info.location}`,
    `Email:    [use 'hire' command]`,
    `GitHub:   ${data.personal_info.github}`,
  ];
  if (data.personal_info.linkedin) {
    contactLines.push(`LinkedIn: ${data.personal_info.linkedin}`);
  }
  if (data.personal_info.phone) {
    contactLines.push(`Phone:    ${data.personal_info.phone}`);
  }

  home.children['contact.txt'] = {
    type: 'file',
    name: 'contact.txt',
    content: contactLines.join('\n'),
  };

  // ── projects/ ───────────────────────────────────────────────
  const projectsDir: FSDirectory = {
    type: 'directory',
    name: 'projects',
    children: {},
  };

  for (const project of data.select_projects) {
    const filename = `${slugify(project.title)}.md`;
    const lines = [
      `# ${project.title}`,
      `> Scope: ${project.scope}`,
      '',
      '## Description',
      project.description,
      '',
      '## Outcome',
      project.outcome,
      '',
      '## Technologies',
      project.technologies.join(', '),
    ];
    if (project.url) {
      lines.push('', `## URL`, project.url);
    }

    projectsDir.children[filename] = {
      type: 'file',
      name: filename,
      content: lines.join('\n'),
    };
  }

  home.children['projects'] = projectsDir;

  // ── experience/ ─────────────────────────────────────────────
  const experienceDir: FSDirectory = {
    type: 'directory',
    name: 'experience',
    children: {},
  };

  for (const exp of data.professional_experience) {
    const filename = `${slugify(exp.company)}.log`;
    const lines = [
      `=== ${exp.company} ===`,
      `Role:   ${exp.role}`,
      `Period: ${exp.start_date} to ${exp.end_date}`,
      `Scope:  ${exp.scope}`,
      '',
      '--- Responsibilities ---',
      ...exp.responsibilities.map((r) => `  > ${r}`),
      '',
      '--- Technologies ---',
      exp.technologies.join(', '),
    ];

    experienceDir.children[filename] = {
      type: 'file',
      name: filename,
      content: lines.join('\n'),
    };
  }

  home.children['experience'] = experienceDir;

  // ── skills/ ─────────────────────────────────────────────────
  const skillsDir: FSDirectory = {
    type: 'directory',
    name: 'skills',
    children: {},
  };

  const skillCategoryMap: Record<string, string> = {
    'Frontend Platform': 'frontend.txt',
    'Developer Experience & Infra': 'devops.txt',
    'Security & Quality': 'security.txt',
    'Data & Performance': 'data.txt',
  };

  for (const cat of data.orderedSkillCategories) {
    const filename =
      skillCategoryMap[cat.category] || `${slugify(cat.category)}.txt`;
    skillsDir.children[filename] = {
      type: 'file',
      name: filename,
      content: [
        `# ${cat.category}`,
        '',
        ...cat.skills.map((s) => `  - ${s}`),
      ].join('\n'),
    };
  }

  home.children['skills'] = skillsDir;

  // ── education/ ──────────────────────────────────────────────
  const educationDir: FSDirectory = {
    type: 'directory',
    name: 'education',
    children: {},
  };

  const certLines = data.education_certifications.map(
    (cert) =>
      `${cert.year ?? 'N/A'}  ${cert.institution.padEnd(45)} ${cert.degree_cert}`,
  );

  educationDir.children['certs.txt'] = {
    type: 'file',
    name: 'certs.txt',
    content: [
      'YEAR  INSTITUTION                                    CERTIFICATION',
      '─'.repeat(90),
      ...certLines,
    ].join('\n'),
  };

  home.children['education'] = educationDir;

  // ── achievements/ ───────────────────────────────────────────
  const achievementsDir: FSDirectory = {
    type: 'directory',
    name: 'achievements',
    children: {},
  };

  achievementsDir.children['summary.txt'] = {
    type: 'file',
    name: 'summary.txt',
    content: [
      '# Additional Information',
      '',
      ...data.additional_information.map((info) => `  - ${info}`),
    ].join('\n'),
  };

  home.children['achievements'] = achievementsDir;

  return root;
}

/* ── Path Resolution ───────────────────────────────────────────── */

/**
 * Normalize a path like "~/aya/projects/../skills" into clean segments.
 */
export function normalizePath(currentPath: string, inputPath: string): string {
  let segments: string[];

  if (inputPath.startsWith('~/') || inputPath === '~') {
    // Absolute from home
    segments = inputPath.split('/').filter(Boolean);
  } else if (inputPath.startsWith('/')) {
    // Absolute from root
    segments = inputPath.split('/').filter(Boolean);
    segments = ['~', ...segments];
  } else {
    // Relative
    const base = currentPath.split('/').filter(Boolean);
    const parts = inputPath.split('/').filter(Boolean);
    segments = [...base, ...parts];
  }

  // Resolve . and ..
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === '.') continue;
    if (seg === '..') {
      if (resolved.length > 1) resolved.pop(); // never go above ~
      continue;
    }
    resolved.push(seg);
  }

  return resolved.join('/') || '~';
}

/**
 * Resolve a path to a node in the filesystem tree.
 */
export function resolvePath(
  root: FSDirectory,
  path: string,
): FSNode | null {
  const segments = path.split('/').filter(Boolean);

  let current: FSNode = root;

  for (const seg of segments) {
    if (seg === '~') {
      current = root;
      continue;
    }
    if (current.type !== 'directory') return null;
    const child: FSNode | undefined = current.children[seg];
    if (!child) return null;
    current = child;
  }

  return current;
}

/**
 * List entries in a directory path. Returns null if not a directory.
 */
export function listDirectory(
  root: FSDirectory,
  path: string,
): { directories: string[]; files: string[] } | null {
  const node = resolvePath(root, path);
  if (!node || node.type !== 'directory') return null;

  const directories: string[] = [];
  const files: string[] = [];

  for (const [name, child] of Object.entries(node.children)) {
    if (child.type === 'directory') {
      directories.push(name + '/');
    } else {
      files.push(name);
    }
  }

  return {
    directories: directories.sort(),
    files: files.sort(),
  };
}

/**
 * Read the content of a file at the given path. Returns null if not a file.
 */
export function readFile(root: FSDirectory, path: string): string | null {
  const node = resolvePath(root, path);
  if (!node || node.type !== 'file') return null;
  return node.content;
}

/**
 * Get tab completions for a partial path.
 */
export function getCompletions(
  root: FSDirectory,
  currentPath: string,
  partial: string,
): string[] {
  // Determine directory to search and prefix to match
  const lastSlash = partial.lastIndexOf('/');
  let dirPath: string;
  let prefix: string;

  if (lastSlash >= 0) {
    const dirPart = partial.slice(0, lastSlash) || '.';
    prefix = partial.slice(lastSlash + 1);
    dirPath = normalizePath(currentPath, dirPart);
  } else {
    prefix = partial;
    dirPath = currentPath;
  }

  const listing = listDirectory(root, dirPath);
  if (!listing) return [];

  const all = [...listing.directories, ...listing.files];
  const lowerPrefix = prefix.toLowerCase();

  return all.filter((name) => name.toLowerCase().startsWith(lowerPrefix));
}
