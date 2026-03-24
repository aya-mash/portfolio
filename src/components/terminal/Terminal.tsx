'use client';

/* ──────────────────────────────────────────────────────────────────
 * Terminal.tsx — Main terminal container (adapted from v1 for window context)
 * ────────────────────────────────────────────────────────────────── */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { DerivedResumeData } from '@/data';
import type { FSDirectory } from '@/lib/filesystem';
import type { OutputSegment } from '@/lib/commands';
import { executeCommand } from '@/lib/commands';
import BootSequence from './BootSequence';
import CommandLine from './CommandLine';
import OutputRenderer from './OutputRenderer';

/* ── Types ─────────────────────────────────────────────────────── */

interface HistoryEntry {
  id: number;
  command: string;
  path: string;
  output: OutputSegment[];
}

interface TerminalProps {
  data: DerivedResumeData;
  fs: FSDirectory;
}

/* ── Uptime formatter ──────────────────────────────────────────── */

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }
  if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

/* ── Component ─────────────────────────────────────────────────── */

export default function Terminal({ data, fs }: TerminalProps) {
  const [booted, setBooted] = useState(false);
  const [currentPath, setCurrentPath] = useState('~/aya');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [uptime, setUptime] = useState(0);
  const [entryCounter, setEntryCounter] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, booted]);

  // Uptime timer
  useEffect(() => {
    if (!booted) return;
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [booted]);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  const handleCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();

      // Track command history (even empty ones for the prompt display)
      if (trimmed) {
        setCommandHistory((prev) => [...prev, trimmed]);
      }

      const result = executeCommand(trimmed, {
        currentPath,
        fs,
        data,
        history: [...commandHistory, ...(trimmed ? [trimmed] : [])],
      });

      // Handle clear
      if (result.clear) {
        setHistory([]);
        return;
      }

      // Handle directory change
      if (result.newPath) {
        setCurrentPath(result.newPath);
      }

      // Handle opening external links
      if (result.openLink) {
        window.open(result.openLink, '_blank');
      }

      // Add to history (even if command was empty, to show the prompt)
      const newId = entryCounter + 1;
      setEntryCounter(newId);

      setHistory((prev) => [
        ...prev,
        {
          id: newId,
          command: trimmed,
          path: currentPath,
          output: result.segments,
        },
      ]);
    },
    [currentPath, fs, data, commandHistory, entryCounter],
  );

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (!booted) {
    return (
      <div className="v1-terminal">
        <div
          className="terminal-scroll"
          style={{ flex: 1, padding: '0' }}
        >
          <BootSequence onComplete={handleBootComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="v1-terminal">
      {/* ── Terminal Output Area ──────────────────────────────── */}
      <div
        ref={scrollRef}
        className="terminal-scroll"
        style={{
          flex: 1,
          padding: '12px 16px',
          overflowY: 'auto',
        }}
      >
        {/* History entries */}
        {history.map((entry) => (
          <div key={entry.id} style={{ marginBottom: '4px' }}>
            {/* The prompt line that was typed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <span className="glow-amber">aya@portfolio</span>
              <span style={{ color: 'var(--term-white)' }}>:</span>
              <span className="glow">{entry.path.replace(/^~/, '~')}</span>
              <span style={{ color: 'var(--term-white)' }}>$ </span>
              <span style={{ color: 'var(--term-fg)' }}>
                {entry.command}
              </span>
            </div>

            {/* Command output */}
            {entry.output.length > 0 && (
              <OutputRenderer segments={entry.output} />
            )}
          </div>
        ))}

        {/* Active command line */}
        <CommandLine
          currentPath={currentPath}
          onSubmit={handleCommand}
          commandHistory={commandHistory}
          fs={fs}
        />
      </div>

      {/* ── Status Bar ───────────────────────────────────────── */}
      <div className="status-bar">
        <span>
          {currentPath.replace(/^~/, '~')}
        </span>
        <span>{today}</span>
        <span>uptime: {formatUptime(uptime)}</span>
      </div>
    </div>
  );
}
