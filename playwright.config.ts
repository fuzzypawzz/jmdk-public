import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  testMatch: /.*.spec.ts/,
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5183',
    trace: 'on-first-retry',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:e2e',
      url: 'http://localhost:5183/',
      reuseExistingServer: true,
    },
  ],
});
