"use client";
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';
import { NeonCard } from './NeonCard';
import { motion } from 'framer-motion';

export function Achievements() {
  const { key_achievements } = loadResume();
  return (
    <SectionShell id="achievements" title="Key Impact" eyebrow="ACHIEVEMENTS">
      <div className="grid md:grid-cols-2 gap-6">
        {key_achievements.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <NeonCard>
              <p className="text-sm leading-relaxed text-slate-300">{a}</p>
            </NeonCard>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
