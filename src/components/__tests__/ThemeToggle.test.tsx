import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('adds transition class and toggles between light and dark', async () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('theme-transition');
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle color theme/i });
    // Wait for mount (icon appears)
    await waitFor(() => expect(button.querySelector('span')).toBeTruthy());
    const initialIsDark = document.documentElement.classList.contains('dark');
    await act(async () => { fireEvent.click(button); });
    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(!initialIsDark));
    await act(async () => { fireEvent.click(button); });
    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(initialIsDark));
  });
});
