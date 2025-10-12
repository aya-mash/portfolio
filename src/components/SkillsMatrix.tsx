"use client";
import { useState } from 'react';
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';
import { NeonCard } from './NeonCard';

type ViewMode = 'competencies' | 'stack';

export function SkillsMatrix() {
  const { core_competencies, technical_stack } = loadResume();
  const [mode, setMode] = useState<ViewMode>('competencies');

  let content: JSX.Element | null = null;

  if (mode === 'competencies' && core_competencies) {
    content = (
      <div className="grid md:grid-cols-2 gap-6">
        {core_competencies.map(c => (
          <NeonCard key={c.title}>
            <h3 className="font-semibold text-soft mb-3 text-xs tracking-wide uppercase font-mono">{c.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {c.items.map(it => (
                <li key={it} className="px-2 py-1 rounded-md bg-white/5 dark:bg-white/10 text-[11px] tracking-wider font-mono uppercase text-soft">
                  {it}
                </li>
              ))}
            </ul>
          </NeonCard>
        ))}
      </div>
    );
  } else if (mode === 'stack' && technical_stack) {
    const entries = Object.entries(technical_stack);
    content = (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map(([group, items]) => (
          <NeonCard key={group}>
            <h3 className="font-semibold text-soft mb-2 text-xs tracking-wide uppercase font-mono">{group}</h3>
            <ul className="flex flex-wrap gap-2">
              {items.map(item => (
                <li key={item} className="px-2 py-1 rounded-md bg-white/5 dark:bg-white/10 text-[11px] tracking-wider font-mono uppercase text-soft">
                  {item}
                </li>
              ))}
            </ul>
          </NeonCard>
        ))}
      </div>
    );
  }

  return (
    <SectionShell id="skills" title="Capabilities" eyebrow="SKILLS">
      <div className="flex flex-wrap gap-2 mb-8 text-[11px] font-mono uppercase tracking-wider">
        <button onClick={() => setMode('competencies')} className={`px-3 py-1 rounded-md border ${mode==='competencies' ? 'border-neon-pink/60 text-neon-pink' : 'border-white/10 text-soft hover:border-white/25'}`}>Core Competencies</button>
        <button onClick={() => setMode('stack')} className={`px-3 py-1 rounded-md border ${mode==='stack' ? 'border-neon-pink/60 text-neon-pink' : 'border-white/10 text-soft hover:border-white/25'}`}>Technical Stack</button>
      </div>
      {content}
    </SectionShell>
  );
}
