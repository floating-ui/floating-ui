import react from '@vitejs/plugin-react';
import {playwright} from '@vitest/browser-playwright';
import {defineViteConfig} from 'config';

export default defineViteConfig({
  server: {
    port: 1234,
  },
  plugins: [react()],
  root: './test/visual',
  test: {
    environment: 'jsdom',
    root: './test/unit',
    browser: {
      provider: playwright(),
      enabled: process.env.TEST_ENV === 'browser',
      instances: [{browser: 'chromium'}],
    },
  },
});
