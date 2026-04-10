'use client';

import type { ProfessionalExperienceItem } from '@/data';

interface ExperienceAppProps {
  experience: ProfessionalExperienceItem[];
}

function formatDateRange(start: string, end: string): { display: string; startISO: string; endISO: string | null } {
  const startDate = new Date(start + '-01');
  const startStr = startDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  if (end === 'Present') {
    return { display: `${startStr} \u2014 Present`, startISO: start, endISO: null };
  }

  const endDate = new Date(end + '-01');
  const endStr = endDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return { display: `${startStr} \u2014 ${endStr}`, startISO: start, endISO: end };
}

export function ExperienceApp({ experience }: ExperienceAppProps) {
  return (
    <div className="experience-app">
      <div className="experience-timeline">
        {experience.map((exp, index) => {
          const isCurrent = exp.end_date === 'Present';
          const dates = formatDateRange(exp.start_date, exp.end_date);

          return (
            <article
              key={`${exp.company}-${index}`}
              className={`experience-item ${isCurrent ? 'current' : ''}`}
            >
              <div className="experience-dot" />
              <div className="experience-company">{exp.company}</div>
              <div className="experience-role">{exp.role}</div>
              <div className="experience-dates">
                <time dateTime={dates.startISO}>{dates.display.split(' \u2014 ')[0]}</time>
                {' \u2014 '}
                {dates.endISO ? (
                  <time dateTime={dates.endISO}>{dates.display.split(' \u2014 ')[1]}</time>
                ) : (
                  'Present'
                )}
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
            </article>
          );
        })}
      </div>
    </div>
  );
}
