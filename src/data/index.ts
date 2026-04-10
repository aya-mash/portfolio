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

/* Career start: 04 January 2021 */
const CAREER_START = new Date(2021, 0, 4);

function computeTotalYears(): number {
  const now = new Date();
  const years =
    (now.getTime() - CAREER_START.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years));
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

  const totalYears = computeTotalYears();

  /* Patch dynamic years into the executive summary */
  const executive_summary = data.executive_summary.replace(
    /\b\d+ years\b/,
    `${totalYears}+ years`,
  );

  cached = {
    ...data,
    executive_summary,
    orderedSkillCategories,
    totalYearsExperience: totalYears,
  };

  return cached;
}
