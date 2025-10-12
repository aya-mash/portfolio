"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  // Start with light to keep deterministic server markup; actual theme synced after mount
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Initialize from localStorage or system preference
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('theme-pref') as 'dark' | 'light' | null) : null;
    const rootHasDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    if (stored) {
      setTheme(stored);
    } else if (rootHasDark) {
      setTheme('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme-pref', theme);
  }, [theme, mounted]);

  const toggle = () => {
    const root = document.documentElement;
    if (!root.classList.contains('theme-transition')) {
      root.classList.add('theme-transition');
    }
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const iconVariants = {
    initial: { scale: 0.4, rotate: -90, opacity: 0 },
    enter: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0.4, rotate: 90, opacity: 0 }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full glass border border-white/10 hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
      aria-label="Toggle color theme"
      suppressHydrationWarning
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            {...iconVariants}
            className="text-lg"
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
