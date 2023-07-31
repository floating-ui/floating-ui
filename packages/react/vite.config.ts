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
      fileName: (format) =>
        `floating-ui.react.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@floating-ui/core',
        '@floating-ui/dom',
        '@floating-ui/react-dom',
        'aria-hidden',
        'tabbable',
        '@floating-ui/utils',
        '@floating-ui/utils/dom',
        '@floating-ui/utils/react',
      ],
    },
  },
  plugins: [
    react(),
    dts({
      entryRoot: resolve(__dirname, 'src'),
    }),
  ],
});
