"use client";
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';
import { NeonCard } from './NeonCard';

export function SkillsMatrix() {
  const { orderedSkillCategories } = loadResume();
  return (
    <SectionShell id="skills" title="Technical Skills" eyebrow="SKILLS">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orderedSkillCategories.map(cat => (
          <NeonCard key={cat.category}>
            <h3 className="font-semibold text-soft mb-2 text-sm tracking-wide uppercase font-mono">{cat.category}</h3>
            <ul className="flex flex-wrap gap-2">
              {cat.skills.map(skill => (
                <li key={skill} className="px-2 py-1 rounded-md bg-white/5 dark:bg-white/10 text-[11px] tracking-wider font-mono uppercase text-soft">
                  {skill}
                </li>
              ))}
            </ul>
          </NeonCard>
        ))}
      </div>
    </SectionShell>
  );
}
