import {defineConfig} from 'tsdown';

export default [
  defineConfig({
    entry: ['./src'],
    external: ['@floating-ui/dom', 'react', 'react-dom'],
    format: ['cjs'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/cjs',
    },
  }),
  defineConfig({
    entry: ['./src'],
    external: ['@floating-ui/dom', 'react', 'react-dom'],
    format: ['esm'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/esm',
    },
    outExtensions: () => ({js: '.js'}),
  }),
];
