import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    terserOptions: {
      ecma: 2020,
    },
    sourcemap: true,
    lib: {
      entry: {
        "utils": resolve(__dirname, 'src/index.ts'),
        "utils.dom": resolve(__dirname, 'dom/src/index.ts'),
        "utils.react": resolve(__dirname, 'react/src/index.ts'),
      },
      name: '@floating-ui/utils',
      fileName: (format, entryName) => `floating-ui.${entryName}.${format === 'es' ? 'esm' : format}.js`,
    },
  },
  plugins: [
    dts({
      entryRoot: resolve(__dirname, 'src'),
      outDir: resolve(__dirname, 'dist/'),
    }),
    dts({
      entryRoot: resolve(__dirname, 'dom/src'),
      outDir: resolve(__dirname, 'dist/dom/'),
    }),
    dts({
      entryRoot: resolve(__dirname, 'react/src'),
      outDir: resolve(__dirname, 'dist/react/'),
    }),
  ]
});
