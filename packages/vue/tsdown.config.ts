import {defineConfig} from 'tsdown';

export default [
  defineConfig({
    entry: ['./src'],
    external: ['@floating-ui/dom', '@floating-ui/dom/utils', 'vue-demi'],
    format: ['cjs'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/cjs',
    },
  }),
  defineConfig({
    entry: ['./src'],
    external: ['@floating-ui/dom', '@floating-ui/dom/utils', 'vue-demi'],
    format: ['esm'],
    unbundle: true,
    outputOptions: {
      dir: 'dist/esm',
    },
    outExtensions: () => ({js: '.js'}),
  }),
];
