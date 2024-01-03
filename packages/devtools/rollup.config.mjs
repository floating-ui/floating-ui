// @ts-check
import alias from '@rollup/plugin-alias';
import {defineRollupConfig} from 'config';
import path from 'path';

export default defineRollupConfig({
  input: [
    {
      name: 'devtools',
      path: './src/index.ts',
      globalVariableName: 'FloatingUIDevtools',
    },
  ],
  plugins: {
    alias: alias({
      entries: [
        {find: 'extension', replacement: path.resolve('../../extension/src')},
      ],
    }),
  },
  globals: {
    '@floating-ui/dom': 'FloatingUIDOM',
  },
  outputs: {
    cjs: false,
    browser: false,
  },
});
