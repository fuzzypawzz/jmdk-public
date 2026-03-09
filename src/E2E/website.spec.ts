import { WebsiteTestHarness } from './website.test-harness';
import { test } from 'playwright/test';

test('renders the website', async ({ page }) => {
  const jmdk = new WebsiteTestHarness(page);
  await jmdk.goToRoot();
  await jmdk.isOnMainPage();
});

test.describe('front page navigation', () => {
  test('goes to my GitHub page in a new tab when clicking on "GitHub"', async ({
    page,
  }) => {
    const jmdk = new WebsiteTestHarness(page);
    const browserTab = jmdk.useNewBrowserTab();
    await jmdk.goToRoot();
    await jmdk.clickOnGitHub();
    await browserTab.waitForNewTabToOpen({
      url: 'https://github.com/fuzzypawzz',
      title: 'fuzzypawzz (Jannik Maag) · GitHub',
    });
  });

  test('goes to my LinkedIn profile in a new tab when clicking on "LinkedIn"', async ({
    page,
  }) => {
    const jmdk = new WebsiteTestHarness(page);
    const browserTab = jmdk.useNewBrowserTab();
    await jmdk.goToRoot();
    await jmdk.clickOnLinkedIn();
    await browserTab.isOnLinkedInFrontPage();
  });

  test('goes to Storybook in a new tab when clicking on "Storybook"', async ({
    page,
  }) => {
    const jmdk = new WebsiteTestHarness(page);
    const browserTab = jmdk.useNewBrowserTab();
    await jmdk.goToRoot();
    await jmdk.clickOnStorybook();
    await browserTab.waitForNewTabToOpen({
      url: 'https://jmdkstorybook.netlify.app/',
    });
  });
});
