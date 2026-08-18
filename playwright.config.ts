import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://demoqa.com',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      retries: process.env.CI ? 2 : 1,
      timeout: 60_000,
      use: {
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
