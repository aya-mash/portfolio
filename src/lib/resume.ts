import resumeData from '../../resume.json';
import { DerivedResumeData, ResumeData } from '@/types/resume';

let cached: DerivedResumeData | null = null;

function computeTotalYears(experiences: ResumeData['professional_experience']): number | undefined {
  if (!experiences.length) return undefined;
  const first = experiences.reduce((earliest, e) => (e.start_date < earliest.start_date ? e : earliest), experiences[0]);
  const start = new Date(first.start_date + '-01');
  const end = new Date();
  const diffYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.round(diffYears * 10) / 10);
}

export function loadResume(): DerivedResumeData {
  if (cached) return cached;
  const data = resumeData as ResumeData;
  const orderedSkillCategories = Object.entries(data.core_technical_skills).map(([category, skills]) => ({
    category,
    skills: [...skills].sort((a, b) => a.localeCompare(b))
  })).sort((a,b)=> a.category.localeCompare(b.category));
  cached = {
    ...data,
    orderedSkillCategories,
    totalYearsExperience: computeTotalYears(data.professional_experience)
  };
  return cached;
}

export type { ResumeData };
