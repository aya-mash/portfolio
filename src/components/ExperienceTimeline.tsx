"use client";
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';
import { motion } from 'framer-motion';

function dateLabel(start: string, end: string) {
  return `${start} – ${end}`;
}

export function ExperienceTimeline() {
  const { professional_experience } = loadResume();
  return (
    <SectionShell id="experience" title="Professional Experience" eyebrow="EXPERIENCE">
      <ol className="relative border-l border-white/10 ml-3 space-y-10">
        {professional_experience.map((exp, idx) => (
          <li key={exp.company + idx} className="ml-6">
            <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-neon-pink/70 to-neon-blue/70 ring-4 ring-black/60" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="glass p-4 rounded-lg"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <h3 className="font-semibold text-lg text-soft">{exp.company}</h3>
                <span className="text-neon-blue/80 text-xs font-mono uppercase tracking-wider">{dateLabel(exp.start_date, exp.end_date)}</span>
              </div>
              <p className="mt-1 text-sm text-neon-green/80 font-mono">{exp.role}</p>
              <ul className="mt-3 space-y-2 list-disc list-outside pl-4 text-sm text-soft/80">
                {exp.responsibilities.map(r => (
                  <li key={r.slice(0,30)}>{r}</li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] uppercase tracking-widest text-muted font-mono">{exp.technologies.join(' · ')}</p>
            </motion.div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
