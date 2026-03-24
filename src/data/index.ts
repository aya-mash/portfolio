/* ──────────────────────────────────────────────────────────────────
 * @portfolios/data — Single source of truth for all three portfolio apps.
 *
 * Reads resume.json once and derives computed fields (years of
 * experience, ordered skill categories) so consumers never have to
 * recompute. The result is cached module-level for the process lifetime.
 * ────────────────────────────────────────────────────────────────── */

import rawResume from './resume.json';
import type { ResumeData, DerivedResumeData } from './types';

export type * from './types';

let cached: DerivedResumeData | null = null;

function computeTotalYears(
  experiences: ResumeData['professional_experience'],
): number {
  if (!experiences.length) return 0;
  const earliest = experiences.reduce((prev, curr) =>
    curr.start_date < prev.start_date ? curr : prev,
  );
  const start = new Date(earliest.start_date + '-01');
  const now = new Date();
  const years =
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.round(years * 10) / 10);
}

export function getResume(): DerivedResumeData {
  if (cached) return cached;

  const data = rawResume as ResumeData;

  const orderedSkillCategories = Object.entries(data.core_technical_skills)
    .map(([category, skills]) => ({
      category,
      skills: [...skills].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  cached = {
    ...data,
    orderedSkillCategories,
    totalYearsExperience: computeTotalYears(data.professional_experience),
  };

  return cached;
}
