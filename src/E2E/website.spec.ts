import { WebsiteTestHarness } from './website.test-harness';
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
