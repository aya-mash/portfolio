'use client';

import type { PersonalInfo } from '@/data';
import { Mail, Github, Linkedin } from 'lucide-react';

interface ContactAppProps {
  info: PersonalInfo;
}

export function ContactApp({ info }: ContactAppProps) {
  return (
    <div className="contact-app">
      {/* Email compose header */}
      <div className="contact-header">
        <div className="contact-field">
          <span className="contact-field-label">To:</span>
          <span className="contact-field-value">Recruiter</span>
        </div>
        <div className="contact-field">
          <span className="contact-field-label">From:</span>
          <span className="contact-field-value">
            {info.preferred_name} ({info.email})
          </span>
        </div>
        <div className="contact-field">
          <span className="contact-field-label">Subject:</span>
          <span className="contact-field-value">
            Let&apos;s work together
          </span>
        </div>
      </div>

      {/* Body with contact links */}
      <div className="contact-body">
        <p className="contact-intro">
          Hi there! I&apos;m {info.name}, a {info.title} based in{' '}
          {info.location}. I&apos;d love to connect and explore how I can
          contribute to your team. Feel free to reach out through any of the
          channels below.
        </p>

        <a
          href={`mailto:${info.email}`}
          className="contact-link-btn"
        >
          <span className="contact-link-icon"><Mail size={20} /></span>
          <span>{info.email}</span>
        </a>

        <a
          href={info.github}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link-btn"
        >
          <span className="contact-link-icon"><Github size={20} /></span>
          <span>GitHub</span>
        </a>

        {info.linkedin && (
          <a
            href={info.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link-btn"
          >
            <span className="contact-link-icon"><Linkedin size={20} /></span>
            <span>LinkedIn</span>
          </a>
        )}

        <a
          href={`mailto:${info.email}?subject=Let's%20work%20together`}
          className="contact-send-btn"
        >
          Send Message
        </a>
      </div>
    </div>
  );
}
