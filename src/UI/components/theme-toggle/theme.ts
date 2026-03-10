export const themeToggleId = 'theme-toggle';

export function useThemeLogic(args?: {
  document?: Document;
  storage?: Storage;
  matchMedia?: (query: string) => { matches: boolean };
}) {
  type Theme = 'light' | 'dark';
  const document = args?.document ?? window.document;
  const storage = args?.storage ?? localStorage;
  const matchMedia =
    args?.matchMedia ?? ((query: string) => window.matchMedia(query));

  function applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeStorage.set(theme);
    getToggleCheckbox().checked = theme === 'dark';
  }

  function prefersDarkColorSchemeQuery() {
    return matchMedia('(prefers-color-scheme: dark)');
  }

  function getToggleCheckbox() {
    const toggleCheckbox = document.getElementById(
      themeToggleId,
    ) as HTMLInputElement | null;

    if (!toggleCheckbox) {
      throw new Error(`Toggle checkbox with ID ${themeToggleId} not found`);
    }

    return toggleCheckbox;
  }

  const themeStorage = (function () {
    const key = 'theme';

    return {
      get() {
        return storage.getItem(key);
      },

      set(value: Theme) {
        return storage.setItem(key, value);
      },
    };
  })();

  function getPreferredTheme(): Theme {
    const preferredTheme = themeStorage.get();

    if (preferredTheme === 'light' || preferredTheme === 'dark') {
      return preferredTheme;
    }

    return prefersDarkColorSchemeQuery().matches ? 'dark' : 'light';
  }

  function syncWithOS() {
    const isDark = prefersDarkColorSchemeQuery().matches;

    applyTheme(isDark ? 'dark' : 'light');
  }

  function syncOnVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;

      const hasUserOverwrittenTheme = !!themeStorage.get();

      if (hasUserOverwrittenTheme) return;

      syncWithOS();
    });
  }

  function syncOnMediaQueryChange() {
    const mediaQuery = prefersDarkColorSchemeQuery();

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', syncWithOS);
    }
  }

  function syncOnToggleChange() {
    const toggleCheckbox = getToggleCheckbox();

    toggleCheckbox.addEventListener('click', () =>
      applyTheme(toggleCheckbox.checked ? 'dark' : 'light'),
    );
  }

  function setup() {
    applyTheme(getPreferredTheme());
    syncOnVisibilityChange();
    syncOnToggleChange();
    syncOnMediaQueryChange();
  }

  return { setup, applyTheme, getPreferredTheme };
}
