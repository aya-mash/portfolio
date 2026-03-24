'use client';

/* ──────────────────────────────────────────────────────────────────
 * OutputRenderer.tsx — Renders command output segments
 * ────────────────────────────────────────────────────────────────── */

import type { OutputSegment } from '@/lib/commands';
import ProjectViewer from './ProjectViewer';
import SkillsRadar from './SkillsRadar';
import FileSystem from './FileSystem';

interface OutputRendererProps {
  segments: OutputSegment[];
}

function TextSegment({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  // Check for directory markers in content (from ls command)
  const hasDirectoryMarkers = content.includes('\x1b[dir]');

  if (hasDirectoryMarkers) {
    return (
      <div className={className}>
        <FileSystem content={content} />
      </div>
    );
  }

  // Render multi-line content preserving whitespace
  return (
    <pre
      className={className}
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        margin: 0,
        font: 'inherit',
      }}
    >
      {content}
    </pre>
  );
}

function TableSegment({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="term-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                // Check if the cell contains a URL
                if (
                  cell.startsWith('http://') ||
                  cell.startsWith('https://')
                ) {
                  return (
                    <td key={ci}>
                      <a
                        href={cell}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cell}
                      </a>
                    </td>
                  );
                }
                return <td key={ci}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LinkSegment({ text, href }: { text: string; href: string }) {
  return (
    <div>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    </div>
  );
}

export default function OutputRenderer({ segments }: OutputRendererProps) {
  return (
    <div style={{ margin: '4px 0 8px 0' }}>
      {segments.map((segment, i) => {
        switch (segment.type) {
          case 'text':
            return (
              <TextSegment
                key={i}
                content={segment.content}
                className={segment.className}
              />
            );
          case 'link':
            return (
              <LinkSegment key={i} text={segment.text} href={segment.href} />
            );
          case 'table':
            return (
              <TableSegment
                key={i}
                headers={segment.headers}
                rows={segment.rows}
              />
            );
          case 'project-view':
            return <ProjectViewer key={i} project={segment.project} />;
          case 'skills-chart':
            return <SkillsRadar key={i} categories={segment.categories} />;
          case 'blank':
            return <div key={i} style={{ height: '1em' }} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
