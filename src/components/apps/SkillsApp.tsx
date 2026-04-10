'use client';

import { useState } from 'react';
import type { NormalizedSkillCategory } from '@/data';
import { Zap, Wrench, Monitor, Shield, Settings, Package, Check, type LucideIcon } from 'lucide-react';

interface SkillsAppProps {
  skills: NormalizedSkillCategory[];
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Data & Performance': Zap,
  'Developer Experience & Infra': Wrench,
  'Frontend Platform': Monitor,
  'Security & Quality': Shield,
};

export function SkillsApp({ skills }: SkillsAppProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent, category: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  return (
    <div className="skills-app">
      <div className="skills-header">
        <Settings size={22} />
        <h2>System Preferences</h2>
      </div>

      <div className="skills-categories-grid">
        {skills.map((cat) => {
          const isExpanded = expandedCategory === cat.category;
          const Icon = CATEGORY_ICONS[cat.category] || Package;

          return (
            <div
              key={cat.category}
              className={`skills-category-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => handleCategoryClick(cat.category)}
              onKeyDown={(e) => handleCategoryKeyDown(e, cat.category)}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${cat.category} — ${cat.skills.length} items`}
            >
              <div className="skills-category-icon"><Icon size={28} /></div>
              <div className="skills-category-title">{cat.category}</div>
              <div className="skills-category-count">
                {cat.skills.length} {cat.skills.length === 1 ? 'item' : 'items'}
              </div>

              {isExpanded && (
                <div className="skills-list">
                  {cat.skills.map((skill) => (
                    <div key={skill} className="skill-item">
                      <span>{skill}</span>
                      <span className="skill-status">
                        <Check size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
