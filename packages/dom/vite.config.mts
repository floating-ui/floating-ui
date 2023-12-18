import {defineViteConfig} from 'config';

export default defineViteConfig({
  server: {
    port: 1234,
  },
  root: './test/visual',
  test: {
    environment: 'jsdom',
    root: './test/unit',
  },
});
