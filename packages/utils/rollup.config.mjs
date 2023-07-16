import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const input = './src/index.ts';

const bundles = [
  {
    input,
    output: {
      file: './dist/floating-ui.utils.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.utils.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.utils.browser.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.utils.browser.min.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIUtils',
      file: './dist/floating-ui.utils.umd.js',
      format: 'umd',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIUtils',
      file: './dist/floating-ui.utils.umd.min.js',
      format: 'umd',
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  plugins: [
    nodeResolve({extensions: ['.ts']}),
    replace({
      __DEV__:
        output.file.includes('.browser.') || output.file.includes('.umd.')
          ? output.file.includes('.min.')
            ? 'false'
            : 'true'
          : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      plugins: ['annotate-pure-calls'],
    }),
    output.file.includes('.min.') && terser(),
  ],
}));
