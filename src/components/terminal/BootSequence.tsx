'use client';

/* ──────────────────────────────────────────────────────────────────
 * BootSequence.tsx — Initial boot animation with system checks
 * ────────────────────────────────────────────────────────────────── */

import { useEffect, useState, useCallback } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

interface BootLine {
  text: string;
  className: string;
  delay: number;
}

const BOOT_LINES: BootLine[] = [
  { text: '', className: 'boot-header', delay: 200 },
  { text: '  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ ', className: 'boot-header', delay: 40 },
  { text: '  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗', className: 'boot-header', delay: 40 },
  { text: '  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║', className: 'boot-header', delay: 40 },
  { text: '  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║', className: 'boot-header', delay: 40 },
  { text: '  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝', className: 'boot-header', delay: 40 },
  { text: '  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ ', className: 'boot-header', delay: 40 },
  { text: '', className: 'boot-header', delay: 200 },
  { text: '  Terminal Portfolio v1.0.0', className: 'boot-info', delay: 300 },
  { text: '', className: '', delay: 100 },
  { text: '[  OK  ] Initializing system...', className: 'boot-ok', delay: 400 },
  { text: '[  OK  ] Loading resume data...', className: 'boot-ok', delay: 350 },
  { text: '[  OK  ] Parsing professional experience...', className: 'boot-ok', delay: 300 },
  { text: '[  OK  ] Indexing select projects...', className: 'boot-ok', delay: 250 },
  { text: '[  OK  ] Building skill matrix...', className: 'boot-ok', delay: 300 },
  { text: '[  OK  ] Mounting /home/aya...', className: 'boot-ok', delay: 350 },
  { text: '[  OK  ] Initializing virtual filesystem...', className: 'boot-ok', delay: 300 },
  { text: '[  OK  ] Starting terminal emulator...', className: 'boot-ok', delay: 400 },
  { text: '', className: '', delay: 200 },
  { text: '  System ready. Welcome.', className: 'boot-info', delay: 500 },
  { text: '', className: '', delay: 100 },
  { text: '  Type \'help\' to see available commands.', className: 'glow', delay: 0 },
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<BootLine[]>([]);
  const [done, setDone] = useState(false);

  const runBoot = useCallback(async () => {
    for (let i = 0; i < BOOT_LINES.length; i++) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, BOOT_LINES[i].delay),
      );
      setVisibleLines((prev) => [...prev, BOOT_LINES[i]]);
    }
    setDone(true);

    // Brief pause then signal complete
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    runBoot();
  }, [runBoot]);

  const handleSkip = useCallback(() => {
    if (!done) {
      setVisibleLines(BOOT_LINES);
      setDone(true);
      onComplete();
    }
  }, [done, onComplete]);

  return (
    <div
      onClick={handleSkip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleSkip();
      }}
      role="button"
      tabIndex={0}
      style={{
        padding: '16px',
        cursor: done ? 'default' : 'pointer',
        minHeight: '100%',
      }}
      aria-label="Boot sequence. Click or press Enter to skip."
    >
      {visibleLines.map((line, i) => (
        <div key={i} className={`boot-line ${line.className}`}>
          {line.text || '\u00A0'}
        </div>
      ))}
      {!done && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            color: 'var(--term-fg-dim)',
            fontSize: '12px',
          }}
        >
          Click or press Enter to skip
        </div>
      )}
    </div>
  );
}
