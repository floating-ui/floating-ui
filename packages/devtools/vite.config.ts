import {resolve} from 'node:path';

import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      extension: resolve(__dirname, '../../extension/src'),
    },
  },
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'umd', 'cjs'],
      fileName: 'index',
      name: 'FloatingUIDevtools',
    },
    outDir: 'dist',
  },
  plugins: [dts({rollupTypes: true})],
});
