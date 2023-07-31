import {resolve} from 'node:path';

import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    terserOptions: {
      ecma: 2020,
    },
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@floating-ui/core',
      fileName: (format) => `floating-ui.core.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: ['@floating-ui/utils']
    }
  },
  plugins: [
    dts({
      entryRoot: resolve(__dirname, 'src'),
    }),
  ],
});
