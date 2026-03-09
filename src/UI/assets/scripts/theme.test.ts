import { describe, it } from 'vitest';
import { useThemeToggle } from './theme';

describe('useThemeToggle', () => {
  it.todo('does not throw when button ID does not exist in the DOM');
  it.todo('applies light theme on click when dark is saved in localStorage');
  it.todo('applies dark theme on click when light is saved in localStorage');
  it.todo(
    'ignores invalid values in localStorage and falls back to system preference',
  );
  it.todo(
    'uses prefers-color-scheme: dark when nothing is saved in localStorage',
  );
  it.todo(
    'uses prefers-color-scheme: light when nothing is saved in localStorage',
  );
  it.todo('persists the applied theme to localStorage');
  it.todo('toggles theme back and forth on repeated clicks');
});
