/* ──────────────────────────────────────────────────────────────────
 * commands.ts — All command handlers for the terminal
 *
 * Each command returns a CommandResult with structured output that
 * the OutputRenderer can display appropriately.
 * ────────────────────────────────────────────────────────────────── */

import type { DerivedResumeData } from '@/data';
import {
  type FSDirectory,
  normalizePath,
  listDirectory,
  readFile,
  resolvePath,
} from './filesystem';

/* ── Output types ──────────────────────────────────────────────── */

export type OutputSegment =
  | { type: 'text'; content: string; className?: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'project-view'; project: DerivedResumeData['select_projects'][number] }
  | { type: 'skills-chart'; categories: { name: string; count: number; skills: string[] }[] }
  | { type: 'blank' };

export interface CommandResult {
  segments: OutputSegment[];
  /** If the command changes directory, return the new path */
  newPath?: string;
  /** If the command should clear the terminal */
  clear?: boolean;
  /** If the command opens an external link */
  openLink?: string;
}

export interface CommandContext {
  currentPath: string;
  fs: FSDirectory;
  data: DerivedResumeData;
  history: string[];
}

/* ── Command registry ──────────────────────────────────────────── */

const COMMANDS: Record<
  string,
  {
    description: string;
    usage?: string;
    handler: (args: string[], ctx: CommandContext) => CommandResult;
  }
> = {
  help: {
    description: 'List all available commands',
    handler: () => ({
      segments: [
        {
          type: 'text',
          content: 'Available commands:',
          className: 'glow-amber',
        },
        { type: 'blank' },
        {
          type: 'table',
          headers: ['Command', 'Description'],
          rows: Object.entries(COMMANDS).map(([name, cmd]) => [
            name + (cmd.usage ? ` ${cmd.usage}` : ''),
            cmd.description,
          ]),
        },
        { type: 'blank' },
        {
          type: 'text',
          content: 'Use Tab for autocomplete. Up/Down arrows for command history.',
          className: 'glow',
        },
      ],
    }),
  },

  whoami: {
    description: 'Display name, title, and summary',
    handler: (_args, ctx) => {
      const { personal_info, executive_summary, totalYearsExperience } =
        ctx.data;
      return {
        segments: [
          {
            type: 'text',
            content: `${personal_info.name} (${personal_info.preferred_name})`,
            className: 'glow-amber',
          },
          {
            type: 'text',
            content: personal_info.title,
            className: 'glow',
          },
          {
            type: 'text',
            content: `Location: ${personal_info.location}`,
          },
          {
            type: 'text',
            content: `Experience: ${totalYearsExperience}+ years`,
          },
          { type: 'blank' },
          { type: 'text', content: executive_summary },
        ],
      };
    },
  },

  ls: {
    description: 'List directory contents',
    usage: '[path]',
    handler: (args, ctx) => {
      const targetPath = args[0]
        ? normalizePath(ctx.currentPath, args[0])
        : ctx.currentPath;

      const listing = listDirectory(ctx.fs, targetPath);
      if (!listing) {
        return {
          segments: [
            {
              type: 'text',
              content: `ls: cannot access '${args[0] || targetPath}': No such directory`,
              className: 'glow',
            },
          ],
        };
      }

      const entries = [
        ...listing.directories.map((d) => ({
          name: d,
          isDir: true,
        })),
        ...listing.files.map((f) => ({
          name: f,
          isDir: false,
        })),
      ];

      if (entries.length === 0) {
        return {
          segments: [
            { type: 'text', content: '(empty directory)' },
          ],
        };
      }

      const content = entries
        .map((e) =>
          e.isDir
            ? `\x1b[dir]${e.name}\x1b[/dir]`
            : e.name,
        )
        .join('  ');

      return {
        segments: [{ type: 'text', content }],
      };
    },
  },

  cd: {
    description: 'Change directory',
    usage: '<path>',
    handler: (args, ctx) => {
      if (!args[0]) {
        return {
          segments: [],
          newPath: '~/aya',
        };
      }

      const newPath = normalizePath(ctx.currentPath, args[0]);
      const node = resolvePath(ctx.fs, newPath);

      if (!node) {
        return {
          segments: [
            {
              type: 'text',
              content: `cd: no such file or directory: ${args[0]}`,
              className: 'glow',
            },
          ],
        };
      }

      if (node.type !== 'directory') {
        return {
          segments: [
            {
              type: 'text',
              content: `cd: not a directory: ${args[0]}`,
              className: 'glow',
            },
          ],
        };
      }

      return {
        segments: [],
        newPath,
      };
    },
  },

  cat: {
    description: 'Read file contents',
    usage: '<file>',
    handler: (args, ctx) => {
      if (!args[0]) {
        return {
          segments: [
            { type: 'text', content: 'cat: missing operand' },
          ],
        };
      }

      const filePath = normalizePath(ctx.currentPath, args[0]);
      const node = resolvePath(ctx.fs, filePath);

      if (!node) {
        return {
          segments: [
            {
              type: 'text',
              content: `cat: ${args[0]}: No such file or directory`,
              className: 'glow',
            },
          ],
        };
      }

      if (node.type === 'directory') {
        return {
          segments: [
            {
              type: 'text',
              content: `cat: ${args[0]}: Is a directory`,
              className: 'glow',
            },
          ],
        };
      }

      // Check if this is a project markdown file — render as split view
      const isProjectFile =
        args[0].includes('projects/') ||
        (ctx.currentPath.includes('projects') && args[0].endsWith('.md'));

      if (isProjectFile) {
        // Find the matching project
        const filename = args[0].split('/').pop() || '';
        const project = ctx.data.select_projects.find((p) => {
          const slug = p.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          return `${slug}.md` === filename;
        });

        if (project) {
          return {
            segments: [{ type: 'project-view', project }],
          };
        }
      }

      const content = readFile(ctx.fs, filePath);
      if (content === null) {
        return {
          segments: [
            {
              type: 'text',
              content: `cat: ${args[0]}: Error reading file`,
              className: 'glow',
            },
          ],
        };
      }

      return {
        segments: [{ type: 'text', content }],
      };
    },
  },

  projects: {
    description: 'List all projects',
    usage: '[--public|--internal]',
    handler: (args, ctx) => {
      let projects = ctx.data.select_projects;

      if (args.includes('--public')) {
        projects = projects.filter(
          (p) => p.scope.toLowerCase() === 'public',
        );
      } else if (args.includes('--internal')) {
        projects = projects.filter(
          (p) => p.scope.toLowerCase() === 'internal',
        );
      }

      const headers = ['#', 'Title', 'Scope', 'Technologies', 'URL'];
      const rows = projects.map((p, i) => [
        String(i + 1),
        p.title,
        p.scope,
        p.technologies.slice(0, 4).join(', ') +
          (p.technologies.length > 4 ? '...' : ''),
        p.url || '—',
      ]);

      const filter = args.includes('--public')
        ? ' (public only)'
        : args.includes('--internal')
          ? ' (internal only)'
          : '';

      return {
        segments: [
          {
            type: 'text',
            content: `Select Projects${filter} — ${projects.length} total`,
            className: 'glow-amber',
          },
          { type: 'blank' },
          { type: 'table', headers, rows },
          { type: 'blank' },
          {
            type: 'text',
            content:
              'Use `cat projects/<name>.md` for detailed view.',
            className: 'glow',
          },
        ],
      };
    },
  },

  skills: {
    description: 'Display skills as ASCII bar chart',
    handler: (_args, ctx) => {
      const categories = ctx.data.orderedSkillCategories.map((cat) => ({
        name: cat.category,
        count: cat.skills.length,
        skills: cat.skills,
      }));

      return {
        segments: [
          {
            type: 'text',
            content: `Core Technical Skills — ${ctx.data.totalYearsExperience}+ years experience`,
            className: 'glow-amber',
          },
          { type: 'blank' },
          { type: 'skills-chart', categories },
          { type: 'blank' },
          {
            type: 'text',
            content: 'Use `ls skills/` or `cat skills/<category>.txt` for details.',
            className: 'glow',
          },
        ],
      };
    },
  },

  experience: {
    description: 'Display professional experience timeline',
    handler: (_args, ctx) => {
      const segments: OutputSegment[] = [
        {
          type: 'text',
          content: 'Professional Experience',
          className: 'glow-amber',
        },
        { type: 'blank' },
      ];

      for (const exp of ctx.data.professional_experience) {
        segments.push({
          type: 'text',
          content: `┌─ ${exp.company}`,
          className: 'glow-amber',
        });
        segments.push({
          type: 'text',
          content: `│  ${exp.role}`,
          className: 'glow',
        });
        segments.push({
          type: 'text',
          content: `│  ${exp.start_date} → ${exp.end_date}`,
        });
        segments.push({
          type: 'text',
          content: `│  ${exp.scope}`,
        });
        segments.push({ type: 'text', content: '│' });

        for (const resp of exp.responsibilities) {
          segments.push({
            type: 'text',
            content: `│  ▸ ${resp}`,
          });
        }

        segments.push({ type: 'text', content: '│' });
        segments.push({
          type: 'text',
          content: `│  Tech: ${exp.technologies.join(', ')}`,
          className: 'glow',
        });
        segments.push({
          type: 'text',
          content: '└' + '─'.repeat(60),
        });
        segments.push({ type: 'blank' });
      }

      return { segments };
    },
  },

  education: {
    description: 'Display education and certifications',
    handler: (_args, ctx) => {
      const headers = ['Year', 'Institution', 'Certification / Degree'];
      const rows = ctx.data.education_certifications.map((cert) => [
        cert.year?.toString() ?? 'N/A',
        cert.institution,
        cert.degree_cert,
      ]);

      return {
        segments: [
          {
            type: 'text',
            content: 'Education & Certifications',
            className: 'glow-amber',
          },
          { type: 'blank' },
          { type: 'table', headers, rows },
        ],
      };
    },
  },

  contact: {
    description: 'Display contact information',
    handler: (_args, ctx) => {
      const info = ctx.data.personal_info;
      const segments: OutputSegment[] = [
        {
          type: 'text',
          content: 'Contact Information',
          className: 'glow-amber',
        },
        { type: 'blank' },
        { type: 'text', content: `  Name:     ${info.name}` },
        { type: 'text', content: `  Title:    ${info.title}` },
        { type: 'text', content: `  Location: ${info.location}` },
        { type: 'blank' },
        {
          type: 'link',
          text: `  Email:    ${info.email}`,
          href: `mailto:${info.email}`,
        },
        {
          type: 'link',
          text: `  GitHub:   ${info.github}`,
          href: info.github,
        },
      ];

      if (info.linkedin) {
        segments.push({
          type: 'link',
          text: `  LinkedIn: ${info.linkedin}`,
          href: info.linkedin,
        });
      }

      if (info.phone) {
        segments.push({
          type: 'text',
          content: `  Phone:    ${info.phone}`,
        });
      }

      return { segments };
    },
  },

  hire: {
    description: 'Open email to get in touch',
    handler: (_args, ctx) => {
      const email = ctx.data.personal_info.email;
      const subject = encodeURIComponent(
        `Opportunity for ${ctx.data.personal_info.name}`,
      );
      const body = encodeURIComponent(
        `Hi ${ctx.data.personal_info.preferred_name},\n\nI came across your terminal portfolio and would love to connect.\n\n`,
      );
      const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

      return {
        segments: [
          {
            type: 'text',
            content: 'Opening email client...',
            className: 'glow',
          },
          {
            type: 'text',
            content: `To: ${email}`,
          },
          {
            type: 'link',
            text: 'Click here if the email client did not open.',
            href: mailto,
          },
        ],
        openLink: mailto,
      };
    },
  },

  clear: {
    description: 'Clear the terminal',
    handler: () => ({
      segments: [],
      clear: true,
    }),
  },

  history: {
    description: 'Show command history',
    handler: (_args, ctx) => {
      if (ctx.history.length === 0) {
        return {
          segments: [{ type: 'text', content: 'No commands in history.' }],
        };
      }

      const lines = ctx.history.map(
        (cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`,
      );

      return {
        segments: [{ type: 'text', content: lines.join('\n') }],
      };
    },
  },
};

/* ── Execute a command string ──────────────────────────────────── */

export function executeCommand(
  input: string,
  ctx: CommandContext,
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { segments: [] };
  }

  const parts = trimmed.split(/\s+/);
  const cmdName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = COMMANDS[cmdName];
  if (!command) {
    return {
      segments: [
        {
          type: 'text',
          content: `command not found: ${cmdName}`,
          className: 'glow',
        },
        {
          type: 'text',
          content: "Type 'help' to see available commands.",
        },
      ],
    };
  }

  return command.handler(args, ctx);
}

/* ── Get all command names for autocomplete ────────────────────── */

export function getCommandNames(): string[] {
  return Object.keys(COMMANDS).sort();
}
