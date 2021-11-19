import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

const NAME = 'popper-react-native';

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
      name: 'PopperDOM',
      file: `dist/${NAME}.umd.js`,
      format: 'umd',
      globals: {
        '@popperjs/core': 'Popper',
        react: 'React',
        'react-native': 'ReactNative',
      },
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
