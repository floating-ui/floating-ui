// @ts-check
import {defineRollupConfig} from 'config';

export default defineRollupConfig({
  input: [
    {
      name: 'core',
      path: './src/index.ts',
      globalVariableName: 'FloatingUICore',
    },
  ],
  globals: {
    '@floating-ui/utils': 'FloatingUIUtils',
  },
  outputs: {
    cjs: false,
    umd: {globals: {}},
    browser: {globals: {}},
  },
});
