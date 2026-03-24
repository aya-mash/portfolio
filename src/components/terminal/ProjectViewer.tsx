'use client';

/* ──────────────────────────────────────────────────────────────────
 * ProjectViewer.tsx — Split-pane code + preview for projects
 * ────────────────────────────────────────────────────────────────── */

import type { ProjectItem } from '@/data';

interface ProjectViewerProps {
  project: ProjectItem;
}

function renderAsSourceCode(project: ProjectItem): string {
  const lines: string[] = [
    `// ${project.title}`,
    `// Scope: ${project.scope}`,
    '',
    `import { Project } from '@portfolio/types';`,
    '',
    `const project: Project = {`,
    `  title: "${project.title}",`,
    `  scope: "${project.scope}",`,
    '',
    `  description:`,
    ...project.description
      .split('. ')
      .map(
        (sentence, i, arr) =>
          `    "${sentence.trim()}${i < arr.length - 1 ? '.' : ''}"${i < arr.length - 1 ? ' +' : ','}`,
      ),
    '',
    `  technologies: [`,
    ...project.technologies.map(
      (t, i) =>
        `    "${t}"${i < project.technologies.length - 1 ? ',' : ''}`,
    ),
    `  ],`,
  ];

  if (project.url) {
    lines.push('', `  url: "${project.url}",`);
  }

  lines.push(`};`, '', `export default project;`);

  return lines.join('\n');
}

function renderAsOutput(project: ProjectItem): string {
  const lines: string[] = [
    `\u250C${'\u2500'.repeat(50)}\u2510`,
    `\u2502 PROJECT: ${project.title.padEnd(39)}\u2502`,
    `\u251C${'\u2500'.repeat(50)}\u2524`,
    `\u2502 Scope: ${project.scope.padEnd(41)}\u2502`,
    `\u251C${'\u2500'.repeat(50)}\u2524`,
    `\u2502 DESCRIPTION                                      \u2502`,
    `\u251C${'\u2500'.repeat(50)}\u2524`,
  ];

  const words = project.description.split(' ');
  let currentLine = '\u2502 ';
  for (const word of words) {
    if (currentLine.length + word.length + 1 > 49) {
      lines.push(currentLine.padEnd(51) + '\u2502');
      currentLine = '\u2502 ' + word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine.trim() !== '\u2502') {
    lines.push(currentLine.padEnd(51) + '\u2502');
  }

  lines.push(`\u251C${'\u2500'.repeat(50)}\u2524`);
  lines.push(`\u2502 OUTCOME                                          \u2502`);
  lines.push(`\u251C${'\u2500'.repeat(50)}\u2524`);

  const outcomeWords = project.outcome.split(' ');
  let outLine = '\u2502 ';
  for (const word of outcomeWords) {
    if (outLine.length + word.length + 1 > 49) {
      lines.push(outLine.padEnd(51) + '\u2502');
      outLine = '\u2502 ' + word + ' ';
    } else {
      outLine += word + ' ';
    }
  }
  if (outLine.trim() !== '\u2502') {
    lines.push(outLine.padEnd(51) + '\u2502');
  }

  lines.push(`\u251C${'\u2500'.repeat(50)}\u2524`);
  lines.push(`\u2502 TECH STACK                                       \u2502`);
  lines.push(`\u251C${'\u2500'.repeat(50)}\u2524`);

  const techLine = project.technologies.join(' | ');
  const techWords = techLine.split(' ');
  let tLine = '\u2502 ';
  for (const word of techWords) {
    if (tLine.length + word.length + 1 > 49) {
      lines.push(tLine.padEnd(51) + '\u2502');
      tLine = '\u2502 ' + word + ' ';
    } else {
      tLine += word + ' ';
    }
  }
  if (tLine.trim() !== '\u2502') {
    lines.push(tLine.padEnd(51) + '\u2502');
  }

  if (project.url) {
    lines.push(`\u251C${'\u2500'.repeat(50)}\u2524`);
    const urlText = `\u2502 URL: ${project.url}`;
    lines.push(urlText.padEnd(51) + '\u2502');
  }

  lines.push(`\u2514${'\u2500'.repeat(50)}\u2518`);

  return lines.join('\n');
}

export default function ProjectViewer({ project }: ProjectViewerProps) {
  const sourceCode = renderAsSourceCode(project);
  const output = renderAsOutput(project);

  return (
    <div className="project-split">
      <div className="project-split-pane">
        <div className="project-split-label">source.ts</div>
        <pre style={{ color: 'var(--term-cyan)' }}>{sourceCode}</pre>
      </div>
      <div className="project-split-pane">
        <div className="project-split-label">output</div>
        <pre style={{ color: 'var(--term-fg)' }}>{output}</pre>
      </div>
    </div>
  );
}
