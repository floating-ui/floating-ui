import {resolve} from 'node:path';

import vue from '@vitejs/plugin-vue';
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
      name: '@floating-ui/vue',
      fileName: (format) => `floating-ui.vue.${format === 'es' ? 'esm' : format}.js`,
    },
  },
  plugins: [
    vue(),
    dts({
      entryRoot: resolve(__dirname, 'src'),
    }),
  ]
});
