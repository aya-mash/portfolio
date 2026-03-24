'use client';

import Image from 'next/image';
import type { DerivedResumeData } from '@/data';

interface AboutAppProps {
  resume: DerivedResumeData;
}

export function AboutApp({ resume }: AboutAppProps) {
  const { personal_info, executive_summary, totalYearsExperience } = resume;

  return (
    <div className="about-app">
      {/* Avatar + header */}
      <div className="about-avatar">
        <Image
          src="/avatar.png"
          alt={personal_info.name}
          width={100}
          height={100}
          priority
        />
      </div>

      <div className="about-header">
        <h1>{personal_info.name}</h1>
        <p>{personal_info.title}</p>
      </div>

      {/* Detail rows */}
      <div className="about-details">
        <div className="about-detail-row">
          <span className="about-detail-label">Preferred</span>
          <span className="about-detail-value">{personal_info.preferred_name}</span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Location</span>
          <span className="about-detail-value">{personal_info.location}</span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Experience</span>
          <span className="about-detail-value">
            {totalYearsExperience}+ years
          </span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Email</span>
          <span className="about-detail-value">{personal_info.email}</span>
        </div>
      </div>

      {/* Summary */}
      <p className="about-summary">{executive_summary}</p>
    </div>
  );
}
