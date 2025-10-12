import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  href?: string;
}

export function NeonCard({ children, className, as = 'div', href }: NeonCardProps) {
  const Comp: any = motion[as] ?? motion.div;
  const base = 'group relative glass p-5 rounded-xl transition-colors overflow-hidden';
  return (
    <Comp
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={`${base} ${className ?? ''}`}
    >
  <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/5 dark:border-white/10 bg-gradient-to-br from-white/40 via-white/0 to-white/0 dark:from-white/10 dark:via-transparent dark:to-black/40" />
  <div className="relative z-10">{children}</div>
  <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(var(--gradient-end)/0.25),transparent_70%)]" />
      {href && <a href={href} className="absolute inset-0" aria-label="Open" />}
    </Comp>
  );
}
