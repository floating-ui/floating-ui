import react from '@vitejs/plugin-react';
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
    setupFiles: ['./setupTests.ts'],
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [{browser: 'chromium'}],
    },
  },
  define: {
    __DEV__: true,
  },
});
