// @ts-check
import {defineRollupConfig} from 'config';

export default defineRollupConfig({
  input: [
    {
      name: 'utils',
      path: './src/index.ts',
      globalVariableName: 'FloatingUIUtils',
    },
    {
      name: 'utils.dom',
      path: './src/dom.ts',
      globalVariableName: 'FloatingUIUtilsDOM',
    },
  ],
  globals: {
    '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
  },
  outputs: {cjs: false, browser: false},
});
