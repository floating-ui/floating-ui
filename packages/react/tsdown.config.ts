import {defineConfig} from 'tsdown';

export default [
  defineConfig({
    entry: ['./src'],
    external: [
      '@floating-ui/react-dom',
      '@floating-ui/core/utils',
      '@floating-ui/dom/utils',
      'tabbable',
      'react',
      'react-dom',
    ],
    format: ['cjs'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/cjs',
    },
    define: {
      __DEV__: 'process.env.NODE_ENV !== "production"',
    },
  }),
  defineConfig({
    entry: ['./src'],
    external: [
      '@floating-ui/react-dom',
      '@floating-ui/core/utils',
      '@floating-ui/dom/utils',
      'tabbable',
      'react',
      'react-dom',
    ],
    format: ['esm'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/esm',
    },
    outExtensions: () => ({js: '.js'}),
    define: {
      __DEV__: 'process.env.NODE_ENV !== "production"',
    },
  }),
];
