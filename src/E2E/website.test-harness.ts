import { type Page, expect } from '@playwright/test';
import { indexContent as content } from '../UI/pages/index.content';

export class WebsiteTestHarness {
  readonly page;
  readonly mainPageHeading;
  readonly githubButton;
  readonly linkedInButton;

  constructor(page: Page) {
    this.page = page;
    this.mainPageHeading = page.getByText(content.heading.text);
    this.githubButton = page.getByRole('button', {
      name: content.buttons[0].label,
    });
    this.linkedInButton = page.getByRole('button', {
      name: content.buttons[1].label,
    });
  }

  async goToRoot() {
    await this.page.goto('/');
  }

  async isOnMainPage() {
    await expect(this.mainPageHeading).toBeVisible();
  }

  async clickOnGitHub() {
    await this.githubButton.click();
  }

  async clickOnLinkedIn() {
    await this.linkedInButton.click();
  }

  useNewBrowserTab() {
    const newTabPromise = this.page.waitForEvent('popup');

    return {
      async waitForNewTabToOpen(args: { url: string; title?: string }) {
        const newTab = await newTabPromise;
        await newTab.waitForLoadState();
        await expect(newTab).toHaveURL(args.url);
        if (args.title) await expect(newTab).toHaveTitle(args.title);
      },

      async isOnLinkedInFrontPage() {
        const newTab = await newTabPromise;
        await newTab.waitForLoadState();
        await expect(
          newTab.getByRole('heading', { name: 'Join LinkedIn' }),
        ).toBeVisible();
      },
    };
  }
}
