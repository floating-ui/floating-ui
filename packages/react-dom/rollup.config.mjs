// @ts-check
import {defineRollupConfig} from 'config';

export default defineRollupConfig({
  input: [
    {
      name: 'react-dom',
      path: './src/index.ts',
      globalVariableName: 'FloatingUIReactDOM',
    },
  ],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@floating-ui/core': 'FloatingUICore',
    '@floating-ui/dom': 'FloatingUIDOM',
  },
  outputs: {
    cjs: false,
    browser: false,
  },
});
