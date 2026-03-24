'use client';

/* ──────────────────────────────────────────────────────────────────
 * CommandLine.tsx — Terminal input with blinking cursor,
 * command history (up/down), and tab autocomplete.
 * ────────────────────────────────────────────────────────────────── */

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { getCommandNames } from '@/lib/commands';
import { getCompletions, type FSDirectory } from '@/lib/filesystem';

interface CommandLineProps {
  currentPath: string;
  onSubmit: (command: string) => void;
  commandHistory: string[];
  fs: FSDirectory;
  disabled?: boolean;
}

export default function CommandLine({
  currentPath,
  onSubmit,
  commandHistory,
  fs,
  disabled = false,
}: CommandLineProps) {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and whenever it becomes enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Click anywhere within the terminal to focus input
  useEffect(() => {
    const terminal = inputRef.current?.closest('.v1-terminal');
    if (!terminal) return;
    const handler = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
      }
    };
    terminal.addEventListener('click', handler);
    return () => terminal.removeEventListener('click', handler);
  }, [disabled]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    onSubmit(trimmed);
    setInput('');
    setHistoryIndex(-1);
    setSavedInput('');
  }, [input, onSubmit]);

  const handleTabComplete = useCallback(() => {
    const trimmed = input.trimStart();
    const parts = trimmed.split(/\s+/);

    if (parts.length <= 1) {
      // Complete command name
      const partial = parts[0] || '';
      const commands = getCommandNames();
      const matches = commands.filter((c) =>
        c.startsWith(partial.toLowerCase()),
      );

      if (matches.length === 1) {
        setInput(matches[0] + ' ');
      } else if (matches.length > 1) {
        // Find common prefix
        let common = matches[0];
        for (let i = 1; i < matches.length; i++) {
          let j = 0;
          while (j < common.length && j < matches[i].length && common[j] === matches[i][j]) {
            j++;
          }
          common = common.slice(0, j);
        }
        if (common.length > partial.length) {
          setInput(common);
        }
      }
    } else {
      // Complete path argument
      const partial = parts[parts.length - 1];
      const completions = getCompletions(fs, currentPath, partial);

      if (completions.length === 1) {
        const completed = completions[0];
        const newParts = [...parts.slice(0, -1), completed];
        // If it's a directory (ends with /), don't add space
        const suffix = completed.endsWith('/') ? '' : ' ';
        // If partial had a path prefix, keep it
        const lastSlash = partial.lastIndexOf('/');
        if (lastSlash >= 0) {
          const prefix = partial.slice(0, lastSlash + 1);
          newParts[newParts.length - 1] = prefix + completed;
        }
        setInput(newParts.join(' ') + suffix);
      } else if (completions.length > 1) {
        // Find common prefix among completions
        let common = completions[0];
        for (let i = 1; i < completions.length; i++) {
          let j = 0;
          while (j < common.length && j < completions[i].length && common[j] === completions[i][j]) {
            j++;
          }
          common = common.slice(0, j);
        }
        if (common.length > (partial.split('/').pop() || '').length) {
          const lastSlash = partial.lastIndexOf('/');
          const prefix = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : '';
          const newParts = [...parts.slice(0, -1), prefix + common];
          setInput(newParts.join(' '));
        }
      }
    }
  }, [input, currentPath, fs]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        handleTabComplete();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        if (historyIndex === -1) {
          setSavedInput(input);
        }

        const newIndex = Math.min(
          historyIndex + 1,
          commandHistory.length - 1,
        );
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex <= 0) {
          setHistoryIndex(-1);
          setInput(savedInput);
          return;
        }

        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        return;
      }

      // Ctrl+C to cancel current input
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        setInput('');
        setHistoryIndex(-1);
        setSavedInput('');
        return;
      }

      // Ctrl+L to clear (like real terminal)
      if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        onSubmit('clear');
        setInput('');
        return;
      }
    },
    [
      handleSubmit,
      handleTabComplete,
      commandHistory,
      historyIndex,
      input,
      savedInput,
      onSubmit,
    ],
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setHistoryIndex(-1);
  }, []);

  // Format the prompt path for display
  const displayPath = currentPath.replace(/^~/, '~');

  if (disabled) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        minHeight: '1.5em',
        flexShrink: 0,
      }}
    >
      <span className="glow-amber" style={{ whiteSpace: 'nowrap' }}>
        aya@portfolio
      </span>
      <span style={{ color: 'var(--term-white)' }}>:</span>
      <span className="glow" style={{ whiteSpace: 'nowrap' }}>
        {displayPath}
      </span>
      <span style={{ color: 'var(--term-white)' }}>$ </span>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
        {/* Overlay for visible cursor */}
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            color: 'var(--term-fg)',
            whiteSpace: 'pre',
          }}
          aria-hidden="true"
        >
          {input}
          <span className="cursor-block" />
        </span>
      </div>
    </div>
  );
}
