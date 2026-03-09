type Theme = 'light' | 'dark';

function getEffectiveTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function useThemeToggle(buttonId: string) {
  const btn = document.getElementById(buttonId);
  btn?.addEventListener('click', () => {
    applyTheme(getEffectiveTheme() === 'dark' ? 'light' : 'dark');
  });
}
