import { expect, it } from 'vitest';
import { themeToggleId, useThemeLogic } from './theme';

it('throws when button ID does not exist in the DOM', () => {
  const document = {
    getElementById() {
      return undefined;
    },
  } as unknown as Document;

  const { attachListeners } = useThemeLogic({ document });

  expect(() => attachListeners()).toThrowError(
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
  } as unknown as Document;
  const storage = createMockStorage();
  const matchMedia = createMatchMedia(false);

  const { attachListeners } = useThemeLogic({ document, storage, matchMedia });

  // expect not to throw
  expect(() => attachListeners()).not.toThrow();
});

it('applies light theme on click when dark is saved in localStorage', () => {
  const { mockDocument, toggleButton } = createMockDocument();
  const storage = createMockStorage({ theme: 'dark' });

  const logic = useThemeLogic({ document: mockDocument, storage });
  logic.attachListeners();
  toggleButton.click();

  expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('light');
  expect(storage._store.theme).toBe('light');
});

it('applies dark theme on click when light is saved in localStorage', () => {
  const { mockDocument, toggleButton } = createMockDocument();
  const storage = createMockStorage({ theme: 'light' });

  const logic = useThemeLogic({ document: mockDocument, storage });
  logic.attachListeners();
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

  const logic = useThemeLogic({ document: mockDocument, storage });
  logic.attachListeners();

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
  };
}

function createMatchMedia(dark: boolean) {
  return (_query: string) => ({ matches: dark });
}
