import { WebsiteTestHarness } from './website.test-harness';
import { ThemeToggleTestHarness } from '../UI/components/theme-toggle/theme-toggle.test-harness';
import { test } from 'playwright/test';

test('smoke test', async ({ page }) => {
  const site = new WebsiteTestHarness(page);
  await site.goToRoot();
  await site.isOnMainPage();
});

test.describe('front page navigation', () => {
  test('goes to my GitHub page in a new tab when clicking the GitHub button', async ({
    page,
  }) => {
    const site = new WebsiteTestHarness(page);
    const browserTab = site.useNewBrowserTab();
    await site.goToRoot();
    await site.clickOnGitHub();
    await browserTab.waitForNewTabToOpen({
      url: 'https://github.com/fuzzypawzz',
      title: 'fuzzypawzz (Jannik Maag) · GitHub',
    });
  });

  test('goes to my LinkedIn profile in a new tab when clicking the LinkedIn button', async ({
    page,
  }) => {
    const site = new WebsiteTestHarness(page);
    const browserTab = site.useNewBrowserTab();
    await site.goToRoot();
    await site.clickOnLinkedIn();
    await browserTab.isOnLinkedInFrontPage();
  });
});

test.describe('darkmode/lightmode toggling', () => {
  test.use({ colorScheme: 'light' });

  test('system theme preference always overrides user-set theme for good UX, starting with lightmode', async ({
    page,
  }) => {
    const site = new WebsiteTestHarness(page);
    const themeToggle = new ThemeToggleTestHarness(page);

    await site.goToRoot();
    // Initially light
    await themeToggle.hasTheme('light');

    // User switches to dark using the toggle
    await page.getByTitle('Toggle theme').click();
    await themeToggle.hasTheme('dark');

    // Users system changes to dark
    await themeToggle.emulateSystemTheme('dark');
    await themeToggle.hasTheme('dark');

    // Users system changes to light, overriding what user has previously set using the toggle
    await themeToggle.emulateSystemTheme('light');
    await themeToggle.hasTheme('light');
  });
});
