'use client';

/* ──────────────────────────────────────────────────────────────────
 * FileSystem.tsx — Virtual filesystem display component
 * ────────────────────────────────────────────────────────────────── */

interface FileSystemProps {
  content: string;
}

export default function FileSystem({ content }: FileSystemProps) {
  const parts = content.split(/\x1b\[dir\](.*?)\x1b\[\/dir\]/);

  return (
    <span>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <span
              key={i}
              style={{
                color: 'var(--term-amber)',
                textShadow: 'var(--term-glow-amber)',
                fontWeight: 'bold',
              }}
            >
              {part}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: 'var(--term-fg)' }}>
            {part}
          </span>
        );
      })}
    </span>
  );
}
