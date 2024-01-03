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
    'vue-demi': 'VueDemi',
    '@floating-ui/dom': 'FloatingUIDOM',
  },
  outputs: {
    cjs: false,
    browser: false,
  },
});
