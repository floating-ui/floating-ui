// @ts-check
import {defineRollupConfig} from 'config';

export default defineRollupConfig({
  input: [
    {
      name: 'vue',
      path: './src/index.ts',
      globalVariableName: 'FloatingUIVue',
    },
  ],
  globals: {
    vue: 'Vue',
    '@floating-ui/dom': 'FloatingUIDOM',
    '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
  },
  outputs: {
    cjs: false,
    browser: false,
  },
});
