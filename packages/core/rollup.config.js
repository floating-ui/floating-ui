import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const NAME = 'popper-core';

export default [
  {
    output: {
      file: `dist/${NAME}.esm.js`,
      format: 'esm',
    },
    minify: false,
  },
  {
    output: {
      file: `dist/${NAME}.esm.min.js`,
      format: 'esm',
    },
    minify: true,
  },
  {
    output: {
      name: 'Popper',
      file: `dist/${NAME}.umd.js`,
      format: 'umd',
    },
    minify: false,
  },
  {
    output: {
      name: 'Popper',
      file: `dist/${NAME}.umd.min.js`,
      format: 'umd',
    },
    minify: true,
  },
].map(({ output, minify }) => ({
  input: 'src/index.js',
  output,
  plugins: [
    babel({
      babelHelpers: 'bundled',
      configFile: path.join(process.cwd(), '../../.config/babel.config'),
    }),
    replace({
      __DEV__: 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    minify && terser(),
  ],
}));
