"use client";
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';
import { NeonCard } from './NeonCard';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

type Tab = 'all' | 'public' | 'internal';

export function ProjectsGallery() {
  const { select_projects } = loadResume();
  const [tab, setTab] = useState<Tab>('all');
  const filtered = useMemo(() => {
    if (tab === 'public') return select_projects.filter(p => p.scope === 'Public');
    if (tab === 'internal') return select_projects.filter(p => p.scope !== 'Public');
    return select_projects;
  }, [tab, select_projects]);
  return (
    <SectionShell id="projects" title="Technical Projects & Experiments" eyebrow="ADDITIONAL WORK">
      <div className="flex flex-wrap gap-2 mb-8 text-[11px] font-mono uppercase tracking-wider">
        <button onClick={() => setTab('all')} className={`px-3 py-1 rounded-md border ${tab==='all' ? 'border-neon-pink/60 text-neon-pink' : 'border-white/10 text-soft hover:border-white/25'}`}>All</button>
        <button onClick={() => setTab('public')} className={`px-3 py-1 rounded-md border ${tab==='public' ? 'border-neon-pink/60 text-neon-pink' : 'border-white/10 text-soft hover:border-white/25'}`}>Public</button>
        <button onClick={() => setTab('internal')} className={`px-3 py-1 rounded-md border ${tab==='internal' ? 'border-neon-pink/60 text-neon-pink' : 'border-white/10 text-soft hover:border-white/25'}`}>Private</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((p, i) => {
          const clickable = p.scope === 'Public' && p.url;
          const content = (
            <NeonCard className="h-full flex flex-col">
              <div className="flex flex-col gap-3 flex-grow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-soft group-hover:text-neon-blue transition-colors" title={p.title}>{p.title}</h3>
                    <p className="text-[11px] text-neon-blue/80 font-mono tracking-widest">{p.scope}</p>
                  </div>
                  {clickable && (
                    <span className="text-[10px] font-mono text-neon-blue/60 group-hover:text-neon-blue/90 transition-colors" aria-hidden>
                      ↗
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-soft/85 flex-grow">{p.description}</p>
                <div className="mt-auto pt-2 space-y-3">
                  <p className="text-xs text-neon-green/80 font-mono">{p.outcome}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.technologies.map(t => (
                      <span key={t} className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-mono tracking-wider uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </NeonCard>
          );
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: i * 0.04 }}
              className={`h-full ${clickable ? 'group focus-within:ring-2 focus-within:ring-neon-blue/70 rounded-md' : ''}`}
            >
              {clickable ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/70 rounded-md"
                  aria-label={`${p.title} repository (opens in new tab)`}
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
