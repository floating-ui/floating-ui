// @ts-check
import {defineRollupConfig} from 'config';

export default defineRollupConfig({
  input: [
    {
      name: 'dom',
      path: './src/index.ts',
      globalVariableName: 'FloatingUIDOM',
    },
  ],
  globals: {
    '@floating-ui/core': 'FloatingUICore',
    '@floating-ui/utils': 'FloatingUIUtils',
    '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
  },
  outputs: {
    cjs: false,
    umd: {
      globals: {
        '@floating-ui/core': 'FloatingUICore',
      },
    },
    browser: {
      globals: {
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
});
