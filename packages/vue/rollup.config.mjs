import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const input = 'src/index.ts';

const bundles = [
  {
    input,
    output: {
      file: './dist/floating-ui.vue.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.vue.esm.min.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIVue',
      file: './dist/floating-ui.vue.umd.js',
      format: 'umd',
      globals: {
        'vue-demi': 'VueDemi',
        '@floating-ui/dom': 'FloatingUIDOM',
      },
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIVue',
      file: './dist/floating-ui.vue.umd.min.js',
      format: 'umd',
      globals: {
        'vue-demi': 'VueDemi',
        '@floating-ui/dom': 'FloatingUIDOM',
      },
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.vue.mjs',
      format: 'esm',
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  external: ['vue-demi', '@floating-ui/dom'],
  plugins: [
    commonjs(),
    nodeResolve({extensions: ['.ts']}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      plugins: ['annotate-pure-calls'],
    }),
    replace({
      __DEV__: output.file.includes('.min.')
        ? 'false'
        : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    output.file.includes('.min.') && terser(),
  ],
}));
