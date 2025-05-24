import {defineConfig} from 'tsdown';

export default [
  defineConfig({
    entry: ['./src'],
    external: ['@floating-ui/core', '@floating-ui/core/utils'],
    format: ['cjs'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/cjs',
    },
  }),
  defineConfig({
    entry: ['./src'],
    external: ['@floating-ui/core', '@floating-ui/core/utils'],
    format: ['esm'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/esm',
    },
    outExtensions: () => ({js: '.js'}),
  }),
];
