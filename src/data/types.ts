/* ──────────────────────────────────────────────────────────────────
 * @portfolios/data — Type definitions for resume.json
 *
 * These mirror the source schema exactly so every consumer gets full
 * type-safety without maintaining separate type files per app.
 * ────────────────────────────────────────────────────────────────── */

export interface PersonalInfo {
  name: string;
  preferred_name: string;
  title: string;
  location: string;
  github: string;
  linkedin?: string;
  email: string;
  phone?: string;
}

export interface ProfessionalExperienceItem {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  scope: string;
  responsibilities: string[];
  technologies: string[];
}

export interface ProjectItem {
  title: string;
  scope: string;
  description: string;
  outcome: string;
  technologies: string[];
  url?: string;
  screenshot?: string;
}

export interface EducationCertItem {
  degree_cert: string;
  institution: string;
  year: number | null;
}

export interface CompetencyCategory {
  title: string;
  items: string[];
}

export interface ResumeData {
  personal_info: PersonalInfo;
  executive_summary: string;
  key_achievements: { heading: string; description: string }[];
  core_technical_skills: Record<string, string[]>;
  core_competencies?: CompetencyCategory[];
  technical_stack?: Record<string, string[]>;
  professional_experience: ProfessionalExperienceItem[];
  select_projects: ProjectItem[];
  education_certifications: EducationCertItem[];
  additional_information: string[];
}

export interface NormalizedSkillCategory {
  category: string;
  skills: string[];
}

export interface DerivedResumeData extends ResumeData {
  orderedSkillCategories: NormalizedSkillCategory[];
  totalYearsExperience: number;
}
