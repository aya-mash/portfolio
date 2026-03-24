'use client';

/* ──────────────────────────────────────────────────────────────────
 * SkillsRadar.tsx — ASCII bar chart for skills
 * ────────────────────────────────────────────────────────────────── */

interface SkillCategory {
  name: string;
  count: number;
  skills: string[];
}

interface SkillsRadarProps {
  categories: SkillCategory[];
}

export default function SkillsRadar({ categories }: SkillsRadarProps) {
  const maxCount = Math.max(...categories.map((c) => c.count));

  return (
    <div>
      {categories.map((cat) => {
        const barLength = Math.round((cat.count / maxCount) * 30);
        const bar = '\u2588'.repeat(barLength);
        const empty = '\u2591'.repeat(30 - barLength);

        return (
          <div key={cat.name} style={{ marginBottom: '8px' }}>
            <div className="skill-bar">
              <span className="skill-bar-label">{cat.name}</span>
              <span className="skill-bar-fill">{bar}</span>
              <span style={{ color: 'var(--term-fg-dim)' }}>{empty}</span>
              <span className="skill-bar-count">{cat.count} skills</span>
            </div>
            <div
              style={{
                marginLeft: '208px',
                color: 'var(--term-white)',
                fontSize: '12px',
                opacity: 0.7,
              }}
            >
              {cat.skills.join(', ')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
