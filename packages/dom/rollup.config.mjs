import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const input = './src/index.ts';

const bundles = [
  {
    input,
    output: {
      file: './dist/floating-ui.dom.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.dom.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.dom.browser.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.dom.browser.min.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIDOM',
      file: './dist/floating-ui.dom.umd.js',
      format: 'umd',
      globals: {
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIDOM',
      file: './dist/floating-ui.dom.umd.min.js',
      format: 'umd',
      globals: {
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  external: ['@floating-ui/core'],
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
