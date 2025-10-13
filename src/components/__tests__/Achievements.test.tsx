import { render, screen } from '@testing-library/react';
import * as resume from '@/lib/resume';
import { Achievements } from '../Achievements';

jest.mock('@/lib/resume');

const mockAchievements = [
  { heading: 'Heading One', description: 'The first description explaining impact.' },
  { heading: 'Single line without colon', description: 'Acts as description text without special parsing.' },
  { heading: 'Another Title', description: 'More detail follows here.' }
];

describe('Achievements component', () => {
  beforeEach(() => {
    (resume as any).loadResume.mockReturnValue({ key_achievements: mockAchievements });
  });

  it('renders all achievement headings and descriptions', () => {
    render(<Achievements />);
    mockAchievements.forEach(a => {
      expect(screen.getByText(a.heading)).toBeInTheDocument();
      expect(screen.getByText(a.description)).toBeInTheDocument();
    });
  });
});
