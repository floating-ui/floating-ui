import vue from '@vitejs/plugin-vue';
import {defineViteConfig} from 'config';

export default defineViteConfig({
  server: {
    port: 1234,
  },
  root: './test/visual',
  plugins: [vue()],
  test: {
    environment: 'warpdom',
    root: './test',
    setupFiles: ['./setupTests.ts'],
  },
});
