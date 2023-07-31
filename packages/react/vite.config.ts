import {resolve} from 'node:path';

import react from '@vitejs/plugin-react';
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
      name: '@floating-ui/react',
      fileName: (format) => `floating-ui.react.${format === 'es' ? 'esm' : format}.js`,
    },
  },
  plugins: [
    react(),
    dts({
      entryRoot: resolve(__dirname, 'src'),
    }),
  ],
});
