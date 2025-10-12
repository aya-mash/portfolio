"use client";
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';
import { NeonCard } from './NeonCard';

export function EducationCerts() {
  const { education_certifications } = loadResume();
  return (
    <SectionShell id="education" title="Education & Certifications" eyebrow="CONTINUOUS LEARNING">
      <div className="grid md:grid-cols-2 gap-6">
        {education_certifications.map(item => (
          <NeonCard key={item.degree_cert}>
            <h3 className="text-sm font-semibold text-soft tracking-wide">{item.degree_cert}</h3>
            <p className="text-xs text-neon-blue/80 font-mono tracking-widest mt-1">{item.institution}</p>
            <p className="text-[11px] text-muted mt-2">{item.year ?? 'Year N/A'}</p>
          </NeonCard>
        ))}
      </div>
    </SectionShell>
  );
}
