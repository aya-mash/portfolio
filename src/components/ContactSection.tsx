"use client";
import { loadResume } from '@/lib/resume';
import { SectionShell } from './SectionShell';

export function ContactSection() {
  const { personal_info } = loadResume();
  return (
    <SectionShell id="contact" title="Contact" eyebrow="CONTACT">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reach Out</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-md">
            Open to roles focused on data-intensive frontend systems, platform UI architecture, and performance-minded React engineering.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href={`mailto:${personal_info.email}`} className="px-4 py-2 rounded-md glass hover:bg-surface-hover border border-white/10">Email</a>
          <a href={personal_info.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md glass hover:bg-surface-hover border border-white/10">GitHub</a>
          <a href="tel:+27849086628" className="px-4 py-2 rounded-md glass hover:bg-surface-hover border border-white/10">Call</a>
        </div>
      </div>
    </SectionShell>
  );
}
