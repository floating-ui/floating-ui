import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const input = './src/index.ts';

const bundles = [
  {
    input,
    output: {
      file: './dist/floating-ui.core.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.core.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.core.browser.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.core.browser.min.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUICore',
      file: './dist/floating-ui.core.umd.js',
      format: 'umd',
      globals: {
        '@floating-ui/utils': 'FloatingUIUtils',
      },
    },
  },
  {
    input,
    output: {
      name: 'FloatingUICore',
      file: './dist/floating-ui.core.umd.min.js',
      format: 'umd',
      globals: {
        '@floating-ui/utils': 'FloatingUIUtils',
      },
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  external:
    output.format === 'umd' || output.file.includes('.browser.')
      ? []
      : ['@floating-ui/utils'],
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
