export interface PersonalInfo {
  name: string;
  preferred_name: string;
  title: string;
  location: string;
  github: string;
  email: string;
  phone: string;
}

export interface ProfessionalExperienceItem {
  company: string;
  role: string;
  start_date: string; // YYYY-MM
  end_date: string; // YYYY-MM or 'Present'
  scope: string;
  responsibilities: string[];
  technologies: string[];
}

export interface ProjectItem {
  title: string;
  scope: string; // Internal / Public
  description: string;
  outcome: string;
  technologies: string[];
  url?: string; // optional repository or live link
}

export interface EducationCertItem {
  degree_cert: string;
  institution: string;
  year: number | null;
}

export interface ResumeData {
  personal_info: PersonalInfo;
  executive_summary: string;
  key_achievements: { heading: string; description: string; }[];
  core_technical_skills: Record<string, string[]>; // category -> skills
  core_competencies?: { title: string; items: string[]; }[];
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
  totalYearsExperience?: number; // optional computed metric
}
