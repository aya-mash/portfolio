"use client";
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';
import { NeonCard } from './NeonCard';

export function AdditionalInfo() {
  const { additional_information } = loadResume();
  return (
    <SectionShell id="additional" title="Additional" eyebrow="MORE INFO">
      <div className="grid md:grid-cols-2 gap-6">
        {additional_information.map(info => (
          <NeonCard key={info.slice(0,30)}>
            <p className="text-sm leading-relaxed text-slate-300">{info}</p>
          </NeonCard>
        ))}
      </div>
    </SectionShell>
  );
}
