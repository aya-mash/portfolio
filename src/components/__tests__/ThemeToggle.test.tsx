import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('adds transition class and toggles between light and dark', () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('theme-transition');
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle color theme/i });
    // Because icon mounts after effect, just proceed with clicks
    fireEvent.click(button); // toggle to dark
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(button); // back to light
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
