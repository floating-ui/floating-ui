import vue from '@vitejs/plugin-vue';
import {defineViteConfig} from '../../config/index.mts';

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
