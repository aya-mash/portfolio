"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = [
  'React',
  'TypeScript',
  'Next.js',
  'TailwindCSS',
  'Accessibility',
  'Performance',
  'Animations',
  'Design Systems',
  'Micro Frontends'
];

export function RoleShowcase() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mt-6 font-mono text-[13px] md:text-sm tracking-wide text-soft/90">
      <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 border border-white/10 text-neon-pink/80">&lt;FrontendEngineer /&gt;</span>
        <span className="text-muted">specialising in</span>
        <span className="relative inline-block h-[1.4em] w-[10ch]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={WORDS[index]}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center text-neon-blue/90 dark:text-neon-blue"
            >
              {WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="hidden sm:inline text-muted">crafting resilient UI pipelines</span>
      </div>
    </div>
  );
}
