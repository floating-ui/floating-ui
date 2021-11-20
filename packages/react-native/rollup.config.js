import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

const NAME = 'popper-react-native';

export default [
  {
    output: {
      file: `dist/${NAME}.mjs`,
      format: 'esm',
    },
    minify: false,
  },
  {
    output: {
      file: `dist/${NAME}.cjs`,
      format: 'cjs',
    },
    minify: false,
  },
].map(({ output, minify }) => ({
  input: 'src/index.js',
  external: ['@popperjs/core', 'react-native', 'react'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      configFile: path.join(process.cwd(), '../../.config/babel.config'),
    }),
    commonjs(),
    replace({
      __DEV__: 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    minify && terser(),
  ],
  output,
}));
