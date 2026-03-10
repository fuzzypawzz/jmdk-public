import { expect, it } from 'vitest';
import { themeToggleId, useThemeLogic } from './theme';

it('throws when button ID does not exist in the DOM', () => {
  const document = {
    getElementById() {
      return undefined;
    },
    documentElement: window.document.documentElement,
    addEventListener: () => {},
  } as unknown as Document;
  const storage = createMockStorage();
  const matchMedia = createMatchMedia(false);

  const { setup } = useThemeLogic({ document, storage, matchMedia });

  expect(() => setup()).toThrowError(
    `Toggle checkbox with ID theme-toggle not found`,
  );
});

it('attaches listeners to the button', () => {
  const document = {
    getElementById(id: string) {
      const element = window.document.createElement('input');
      element.type = 'checkbox';
      element.id = id;
      return element;
    },
    documentElement: window.document.documentElement,
    addEventListener: () => {},
  } as unknown as Document;
  const storage = createMockStorage();
  const matchMedia = createMatchMedia(false);

  const { setup } = useThemeLogic({ document, storage, matchMedia });

  // expect not to throw
  expect(() => setup()).not.toThrow();
});

it('applies light theme on click when dark is saved in localStorage', () => {
  const { mockDocument, toggleButton } = createMockDocument();
  const storage = createMockStorage({ theme: 'dark' });
  const matchMedia = createMatchMedia(false);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });
  logic.setup();
  toggleButton.click();

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('light');
  expect(storage._store.theme).toBe('light');
});

it('applies dark theme on click when light is saved in localStorage', () => {
  const { mockDocument, toggleButton } = createMockDocument();
  const storage = createMockStorage({ theme: 'light' });
  const matchMedia = createMatchMedia(false);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });
  logic.setup();
  toggleButton.click();

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(storage._store.theme).toBe('dark');
});

it('ignores invalid values in localStorage and falls back to system preference', () => {
  const { mockDocument } = createMockDocument();
  const storage = createMockStorage({ theme: 'invalid' });
  const matchMedia = createMatchMedia(true);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });

  expect(logic.getPreferredTheme()).toBe('dark');
});

it('uses prefers-color-scheme: dark when nothing is saved in localStorage', () => {
  const { mockDocument } = createMockDocument();
  const storage = createMockStorage();
  const matchMedia = createMatchMedia(true);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });

  expect(logic.getPreferredTheme()).toBe('dark');
});

it('uses prefers-color-scheme: light when nothing is saved in localStorage', () => {
  const { mockDocument } = createMockDocument();
  const storage = createMockStorage();
  const matchMedia = createMatchMedia(false);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });

  expect(logic.getPreferredTheme()).toBe('light');
});

it('persists the applied theme to localStorage', () => {
  const { mockDocument } = createMockDocument();
  const storage = createMockStorage();

  const logic = useThemeLogic({ document: mockDocument, storage });
  logic.applyTheme('dark');

  expect(storage._store.theme).toBe('dark');
});

it('toggles theme back and forth on repeated clicks', () => {
  const { mockDocument, toggleButton } = createMockDocument();
  const storage = createMockStorage({ theme: 'dark' });
  const matchMedia = createMatchMedia(false);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });
  logic.setup();

  toggleButton.click();
  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('light');

  toggleButton.click();
  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('dark');
});

function createMockDocument() {
  const toggleButton = window.document.createElement('input');
  toggleButton.type = 'checkbox';
  toggleButton.id = themeToggleId;

  const mockDocument = {
    getElementById: (_id: string) => toggleButton,
    documentElement: window.document.documentElement,
    addEventListener: () => {},
  } as unknown as Document;

  return { mockDocument, toggleButton };
}

function createMockStorage(initial: Record<string, string> = {}) {
  const _store = { ...initial };
  return {
    getItem: (key: string) => _store[key] ?? null,
    setItem: (key: string, value: string) => {
      _store[key] = value;
    },
    _store,
  } as unknown as Storage;
}

it('overwrites user-set theme when OS preference changes', () => {
  const { mockDocument } = createMockDocument();
  // The user manually sets dark theme
  const storage = createMockStorage({ theme: 'dark' });
  // The system currently prefers light theme
  const matchMedia = createMatchMedia(false);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });
  logic.setup();

  // Confirm user override is applied
  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(storage._store.theme).toBe('dark');

  // The system preference changes to dark which should overwrite the user's stored preference
  matchMedia._fireChange(true);

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('dark');
});

it('overwrites user-set dark theme when OS switches to light', () => {
  const { mockDocument } = createMockDocument();
  // The user manually set dark theme
  const storage = createMockStorage({ theme: 'dark' });
  // The system currently prefers dark theme
  const matchMedia = createMatchMedia(true);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });
  logic.setup();

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('dark');

  // The system preference switches to light which should overwrite the user's stored preference
  matchMedia._fireChange(false);

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('light');
  expect(storage._store.theme).toBe('light');
});

it('overwrites user-set light theme when OS switches to dark', () => {
  const { mockDocument } = createMockDocument();
  // The user manually set light theme
  const storage = createMockStorage({ theme: 'light' });
  // The system currently prefers light theme
  const matchMedia = createMatchMedia(false);

  const logic = useThemeLogic({ document: mockDocument, storage, matchMedia });
  logic.setup();

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('light');

  // The system preference switches to dark which should overwrite the user's stored preference
  matchMedia._fireChange(true);

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(storage._store.theme).toBe('dark');
});

function createMatchMedia(dark: boolean) {
  let _matches = dark;
  let _listener: ((e: { matches: boolean }) => void) | null = null;

  const mock = (_query: string) =>
    ({
      get matches() {
        return _matches;
      },
      addEventListener(
        _event: string,
        listener: (e: { matches: boolean }) => void,
      ) {
        _listener = listener;
      },
    }) as MediaQueryList;

  mock._fireChange = (newDark: boolean) => {
    _matches = newDark;
    _listener?.({ matches: newDark });
  };

  return mock as any;
}
