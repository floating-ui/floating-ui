import {defineConfig} from '@playwright/test';

export default defineConfig({
  retries: 3,
  workers: 4,
  fullyParallel: true,
  use: {
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
  },
  webServer: {
    command: 'pnpm run dev',
    port: 1234,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
