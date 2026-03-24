'use client';

import { useState, useMemo } from 'react';
import type { ProjectItem } from '@/data';

interface ProjectsAppProps {
  projects: ProjectItem[];
}

type FilterScope = 'All' | 'Public' | 'Internal';

export function ProjectsApp({ projects }: ProjectsAppProps) {
  const [filter, setFilter] = useState<FilterScope>('All');

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) => p.scope === filter);
  }, [projects, filter]);

  const filters: FilterScope[] = ['All', 'Public', 'Internal'];

  return (
    <div className="projects-app">
      {/* Filter bar */}
      <div className="projects-filter-bar">
        {filters.map((f) => (
          <button
            key={f}
            className={`projects-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} ({f === 'All' ? projects.length : projects.filter((p) => p.scope === f).length})
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div key={project.title} className="project-card">
            <div className="project-card-header">
              <h3>{project.title}</h3>
              <span
                className={`project-scope-badge ${project.scope.toLowerCase()}`}
              >
                {project.scope}
              </span>
            </div>
            <p className="project-card-description">{project.description}</p>
            <div className="project-card-tags">
              {project.technologies.map((tech) => (
                <span key={tech} className="project-tag">
                  {tech}
                </span>
              ))}
            </div>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-open-btn"
              >
                Open &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
