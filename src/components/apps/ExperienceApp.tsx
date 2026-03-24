'use client';

import type { ProfessionalExperienceItem } from '@/data';

interface ExperienceAppProps {
  experience: ProfessionalExperienceItem[];
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + '-01');
  const startStr = startDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  if (end === 'Present') return `${startStr} \u2014 Present`;

  const endDate = new Date(end + '-01');
  const endStr = endDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return `${startStr} \u2014 ${endStr}`;
}

export function ExperienceApp({ experience }: ExperienceAppProps) {
  return (
    <div className="experience-app">
      <div className="experience-timeline">
        {experience.map((exp, index) => {
          const isCurrent = exp.end_date === 'Present';

          return (
            <div
              key={`${exp.company}-${index}`}
              className={`experience-item ${isCurrent ? 'current' : ''}`}
            >
              <div className="experience-dot" />
              <div className="experience-company">{exp.company}</div>
              <div className="experience-role">{exp.role}</div>
              <div className="experience-dates">
                {formatDateRange(exp.start_date, exp.end_date)}
              </div>
              {exp.scope && (
                <div className="experience-scope">{exp.scope}</div>
              )}
              <ul className="experience-responsibilities">
                {exp.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="experience-tech-tags">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
