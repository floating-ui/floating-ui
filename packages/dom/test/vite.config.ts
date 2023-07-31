import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  server: {
    port: 1234,
  },
  root: './visual',
  plugins: [react()],
  resolve: {
    alias: {
      '@floating-ui/utils/dom': resolve(__dirname, '../../utils/dom/src/index.ts'),
      '@floating-ui/utils/react': resolve(
        __dirname,
        '../../utils/react/src/index.ts'
      ),
      '@floating-ui/utils': resolve(__dirname, '../../utils/src/index.ts'),
      '@floating-ui/core': resolve(__dirname, '../../core/src/index.ts'),
      '@floating-ui/dom': resolve(__dirname, '../../dom/src/index.ts'),
      '@floating-ui/react-dom': resolve(__dirname, '../../react-dom/src/index.ts'),
      '@floating-ui/react': resolve(__dirname, '../../react/src/index.ts'),
      '@floating-ui/vue': resolve(__dirname, '../../vue/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    root: './test/unit',
    globals: true,
  },
});
