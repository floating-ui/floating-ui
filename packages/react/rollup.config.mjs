// @ts-check
import {defineRollupConfig} from 'config';

export default defineRollupConfig({
  input: [
    // NOTE: react.utils should be built first, as react depends on it
    {
      name: 'react.utils',
      path: './src/utils.ts',
      globalVariableName: 'FloatingUIReactUtils',
    },
    {
      name: 'react',
      path: './src/index.ts',
      globalVariableName: 'FloatingUIReact',
    },
  ],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'aria-hidden': 'ariaHidden',
    tabbable: 'tabbable',
    '@floating-ui/core': 'FloatingUICore',
    '@floating-ui/dom': 'FloatingUIDOM',
    '@floating-ui/react-dom': 'FloatingUIReactDOM',
    '@floating-ui/utils': 'FloatingUIUtils',
    '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
    '@floating-ui/react/utils': 'FloatingUIReactUtils',
    'react/jsx-runtime': 'jsxRuntime',
  },
  outputs: {
    cjs: false,
    browser: false,
    umd: {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@floating-ui/core': 'FloatingUICore',
        '@floating-ui/dom': 'FloatingUIDOM',
        '@floating-ui/react-dom': 'FloatingUIReactDOM',
        'react/jsx-runtime': 'jsxRuntime',
      },
    },
  },
});
