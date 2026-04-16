import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  retries: 0,
  workers: 3,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        headless: true,
        screenshot: 'off',
        trace: 'on',
      },
    },
    {
      name: 'safari',
      use: {
        browserName: 'webkit',
        headless: true,
        screenshot: 'off',
        trace: 'on',
        ...devices['iPhone 11'],
      },
    },
    {
      name: 'chrome-headed',
      use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'on',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        permissions: ['geolocation'],
        trace: 'on',
      },
    },
  ],
});
