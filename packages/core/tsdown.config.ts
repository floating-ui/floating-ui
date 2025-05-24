import {defineConfig} from 'tsdown';

export default [
  defineConfig({
    entry: ['./src'],
    format: ['cjs'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/cjs',
    },
  }),
  defineConfig({
    entry: ['./src'],
    format: ['esm'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/esm',
    },
    outExtensions: () => ({js: '.js'}),
  }),
];
