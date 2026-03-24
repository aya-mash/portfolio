'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Achievement {
  heading: string;
  description: string;
}

interface AchievementsAppProps {
  achievements: Achievement[];
}

type SortField = 'heading' | 'description' | 'status';
type SortDir = 'asc' | 'desc';

export function AchievementsApp({ achievements }: AchievementsAppProps) {
  const [sortField, setSortField] = useState<SortField>('heading');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    const copy = [...achievements];
    copy.sort((a, b) => {
      let valA: string;
      let valB: string;

      if (sortField === 'heading') {
        valA = a.heading;
        valB = b.heading;
      } else if (sortField === 'description') {
        valA = a.description;
        valB = b.description;
      } else {
        return 0; // status is always "Completed"
      }

      const cmp = valA.localeCompare(valB);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [achievements, sortField, sortDir]);

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
  };

  return (
    <div className="achievements-app">
      <div className="achievements-toolbar">
        <span className="achievements-count">
          {achievements.length} processes
        </span>
        <span>|</span>
        <span>All completed</span>
      </div>

      <div className="achievements-table">
        <table>
          <thead>
            <tr>
              <th className="col-process" onClick={() => handleSort('heading')}>
                Process Name
                <span className="sort-indicator">{sortIndicator('heading')}</span>
              </th>
              <th onClick={() => handleSort('description')}>
                Description
                <span className="sort-indicator">
                  {sortIndicator('description')}
                </span>
              </th>
              <th className="col-status" onClick={() => handleSort('status')}>
                Status
                <span className="sort-indicator">{sortIndicator('status')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a, i) => (
              <tr key={i}>
                <td className="achievement-name">{a.heading}</td>
                <td className="achievement-desc">
                  {a.description}
                </td>
                <td>
                  <span className="achievement-status">
                    <span className="achievement-status-dot" />
                    Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
