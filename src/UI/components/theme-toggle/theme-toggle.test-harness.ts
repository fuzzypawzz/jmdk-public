import { type Page, expect } from '@playwright/test';

export class ThemeToggleTestHarness {
  private readonly page;

  constructor(page: Page) {
    this.page = page;
  }

  async emulateSystemTheme(scheme: 'light' | 'dark') {
    await this.page.emulateMedia({ colorScheme: scheme });
  }

  async getAppliedTheme() {
    return this.page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
  }

  async hasTheme(theme: 'light' | 'dark') {
    await expect(this.page.locator('html')).toHaveAttribute(
      'data-theme',
      theme,
    );
    await expect(this.page.locator('#theme-toggle')).toBeChecked({
      checked: theme === 'dark',
    });
  }
}
