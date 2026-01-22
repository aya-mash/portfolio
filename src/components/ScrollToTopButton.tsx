"use client";
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > 480); // threshold
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = useCallback(() => {
    if (reducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={scrollTop}
          aria-label="Scroll to top"
          className="hidden md:flex group fixed bottom-6 right-6 z-50 rounded-full p-3 backdrop-blur-md border border-white/15 bg-gradient-to-br from-white/15 via-white/5 to-white/0 dark:from-white/10 dark:via-white/5 dark:to-black/40 shadow-glow hover:shadow-inner-glow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <span className="relative flex items-center justify-center w-5 h-5 text-neon-blue group-hover:text-neon-pink transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
