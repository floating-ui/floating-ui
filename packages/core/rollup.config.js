import path from 'path';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const NAME = 'popper-core';

export default [
  {
    output: {
      file: path.join(__dirname, `dist/${NAME}.mjs`),
      format: 'esm',
    },
    minify: false,
  },
  {
    output: {
      file: path.join(__dirname, `dist/${NAME}.min.mjs`),
      format: 'esm',
    },
    minify: true,
  },
  {
    output: {
      name: 'Popper',
      file: path.join(__dirname, `dist/${NAME}.js`),
      format: 'umd',
    },
    minify: false,
  },
  {
    output: {
      name: 'Popper',
      file: path.join(__dirname, `dist/${NAME}.min.js`),
      format: 'umd',
    },
    minify: true,
  },
].map(({ output, minify }) => ({
  input: path.join(__dirname, 'src/index.js'),
  output,
  plugins: [
    babel({
      babelHelpers: 'bundled',
      configFile: require.resolve('../../.config/babel.config'),
    }),
    replace({
      __DEV__: 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    minify && terser(),
  ],
}));
