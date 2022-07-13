import { PlaywrightTestConfig, devices } from '@playwright/test';
import { devices as replayDevices } from "@replayio/playwright";


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
      name: "replay-firefox",
      use: { ...replayDevices["Replay Firefox"] as any },
    },
    {
      name: "replay-chromium",
      use: { ...replayDevices["Replay Chromium"] as any },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chromium"] },
    },
  ],
};

export default config;
