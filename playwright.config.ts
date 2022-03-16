import {PlaywrightTestConfig, devices} from '@playwright/test';
import {devices as replayDevices} from '@replayio/playwright';

const config: PlaywrightTestConfig = {
  use: {
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
  },
  webServer: {
    command: 'npm run dev',
    port: 1234,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'replay-chromium',
      use: {
        ...replayDevices["Replay Chromium"] as any
      }
    },
    {
      name: 'replay-firefox',
      use: {
        ...(replayDevices['Replay Firefox'] as any),
      },
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
