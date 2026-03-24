'use client';

import type { EducationCertItem } from '@/data';
import { ScrollText } from 'lucide-react';

interface EducationAppProps {
  certs: EducationCertItem[];
}

export function EducationApp({ certs }: EducationAppProps) {
  return (
    <div className="education-app">
      <div className="education-grid">
        {certs.map((cert, index) => (
          <div key={`${cert.degree_cert}-${index}`} className="education-card">
            <div className="education-icon"><ScrollText size={32} /></div>
            <div className="education-info">
              <h3>{cert.degree_cert}</h3>
              <p className="institution">{cert.institution}</p>
              <p className="year">
                {cert.year ? cert.year : 'In Progress'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
