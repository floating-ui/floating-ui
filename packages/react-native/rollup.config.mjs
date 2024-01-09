// @ts-check
import {defineRollupConfig} from 'config';

export default defineRollupConfig({
  input: [
    {
      name: 'react-native',
      path: './src/index.ts',
      globalVariableName: 'FloatingUIReactNative',
    },
  ],
  globals: {
    react: 'React',
    'react-native': 'ReactNative',
    '@floating-ui/core': 'FloatingUICore',
  },
  outputs: {
    browser: false,
    umd: false,
    mjs: false,
    cjs: {
      file: './dist/floating-ui.react-native.js',
    },
  },
});
