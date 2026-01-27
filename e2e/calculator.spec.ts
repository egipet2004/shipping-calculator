import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 👇 САМОЕ ВАЖНОЕ: Говорим Playwright смотреть ТОЛЬКО в папку e2e
  testDir: './e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like await page.goto('/'). */
    baseURL: 'http://localhost:3000', // Указываем адрес вашего запущенного сайта

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Можно раскомментировать, если нужны другие браузеры
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev', // Команда запуска вашего сайта
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});