import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@floating-ui/utils/dom': path.resolve(
        __dirname,
        '../utils/dom/src/index.ts',
      ),
      '@floating-ui/utils/react': path.resolve(
        __dirname,
        '../utils/react/src/index.ts',
      ),
      '@floating-ui/utils': path.resolve(__dirname, '../utils/src/index.ts'),
      '@floating-ui/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@floating-ui/dom': path.resolve(__dirname, '../dom/src/index.ts'),
      '@floating-ui/react-dom': path.resolve(
        __dirname,
        '../react-dom/src/index.ts',
      ),
      '@floating-ui/react': path.resolve(__dirname, '../react/src/index.ts'),
      '@floating-ui/vue': path.resolve(__dirname, '../vue/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    testTransformMode: {web: ['/.[jt]sx?$/']},
  },
});
