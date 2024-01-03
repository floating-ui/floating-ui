import {defineViteConfig} from 'config';

export default defineViteConfig({
  server: {
    port: 1234,
  },
  root: './test',
  test: {
    environment: 'jsdom',
    root: './test',
    setupFiles: ['./setupTests.ts'],
  },
});
