import type {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
  },
  webServer: {
    command: 'serve -l 1234 test/visual',
    port: 1234,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
