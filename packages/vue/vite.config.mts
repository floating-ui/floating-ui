import {defineViteConfig} from 'config';
import vue from '@vitejs/plugin-vue';

export default defineViteConfig({
  server: {
    port: 1234,
  },
  root: './test/visual',
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    root: './test',
    setupFiles: ['./setupTests.ts'],
  },
});
