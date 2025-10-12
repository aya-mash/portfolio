import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionShellProps {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export function SectionShell({ id, title, eyebrow, children, className }: SectionShellProps) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-14 ${className ?? ''}`.trim()}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10"
        >
          {eyebrow && <p className="text-xs uppercase tracking-[0.25em] text-neon-blue/80 mb-2 font-mono">{eyebrow}</p>}
          <h2 className="text-2xl md:text-3xl font-semibold neon-text bg-clip-text leading-tight">
            {title}
          </h2>
        </motion.header>
        <div>{children}</div>
      </div>
    </section>
  );
}
