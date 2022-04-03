import {PlaywrightTestConfig, devices} from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
  },
  webServer: {
    command: 'npm -w packages/dom run dev',
    port: 1234,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    // {
    //   name: 'firefox',
    //   use: {...devices['Desktop Firefox']},
    // },
    // {
    //   name: 'webkit',
    //   use: {...devices['Desktop Safari']},
    // },
  ],
};

export default config;
