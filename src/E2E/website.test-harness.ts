import { type Page, expect } from '@playwright/test'

export class JMDKTestHarness {
  readonly page
  readonly mainPageHeading
  readonly githubButton
  readonly linkedInButton
  readonly storybookButton

  constructor(page: Page) {
    this.page = page
    this.mainPageHeading = page.getByText('Jannik Maag')
    this.githubButton = page.getByRole('button', { name: 'My GitHub' })
    this.storybookButton = page.getByRole('button', { name: 'Storybook' })
    this.linkedInButton = page.getByRole('button', {
      name: 'My profile on LinkedIn',
    })
  }

  async goToRoot() {
    await this.page.goto('/')
  }

  async isOnMainPage() {
    await expect(this.mainPageHeading).toBeVisible()
  }

  async clickOnGitHub() {
    await this.githubButton.click()
  }

  async clickOnStorybook() {
    await this.storybookButton.click()
  }

  async clickOnLinkedIn() {
    await this.linkedInButton.click()
  }

  useNewBrowserTab() {
    const newTabPromise = this.page.waitForEvent('popup')

    return {
      async waitForNewTabToOpen(args: { url: string; title?: string }) {
        const newTab = await newTabPromise
        await newTab.waitForLoadState()
        await expect(newTab).toHaveURL(args.url)
        if (args.title) await expect(newTab).toHaveTitle(args.title)
      },

      async isOnLinkedInFrontPage() {
        const newTab = await newTabPromise
        await newTab.waitForLoadState()
        await expect(
          newTab.getByRole('heading', { name: 'Join LinkedIn' }),
        ).toBeVisible()
      },
    }
  }
}
