import {defineConfig} from 'vitest/config';
export default defineConfig({
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      // at least one instance is required
      instances: [{browser: 'chromium'}],
    },
  },
});
