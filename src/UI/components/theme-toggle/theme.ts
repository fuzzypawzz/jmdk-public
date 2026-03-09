type Theme = 'light' | 'dark';
export const themeToggleId = 'theme-toggle';

export function useThemeLogic(args?: {
  document?: Document;
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
  matchMedia?: (query: string) => { matches: boolean };
}) {
  const document = args?.document ?? window.document;
  const storage = args?.storage ?? localStorage;
  const matchMedia =
    args?.matchMedia ?? ((query: string) => window.matchMedia(query));

  function applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
    storage.setItem('theme', theme);
  }

  function getPreferredTheme(): Theme {
    const preferredTheme = storage.getItem('theme');

    if (preferredTheme === 'light' || preferredTheme === 'dark') {
      return preferredTheme;
    }

    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function attachListeners() {
    const toggleCheckbox = document.getElementById(
      themeToggleId,
    ) as HTMLInputElement | null;

    if (!toggleCheckbox) {
      throw new Error(`Toggle checkbox with ID ${themeToggleId} not found`);
    }

    toggleCheckbox.checked = getPreferredTheme() === 'dark';

    toggleCheckbox.addEventListener('click', () => {
      applyTheme(toggleCheckbox.checked ? 'dark' : 'light');
    });
  }

  return { attachListeners, applyTheme, getPreferredTheme };
}
