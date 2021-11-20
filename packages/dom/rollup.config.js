import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const NAME = 'popper-dom';

const devExport = {
  input: './src/index.js',
  output: {
    file: 'tests/visual/dist/index.js',
    format: 'esm',
  },
  plugins: [
    babel({
      babelHelpers: process.env.NODE_ENV === 'test' ? 'inline' : 'bundled',
      configFile: path.join(process.cwd(), '../../.config/babel.config'),
    }),
    replace({
      'process.env.NODE_ENV': '"production"',
      preventAssignment: true,
    }),
    nodeResolve(),
  ],
};

const buildExport = [
  {
    output: {
      file: `dist/${NAME}.mjs`,
      format: 'esm',
    },
    minify: false,
  },
  {
    output: {
      file: `dist/${NAME}.min.mjs`,
      format: 'esm',
    },
    minify: true,
  },
  {
    output: {
      name: 'PopperDOM',
      file: `dist/${NAME}.js`,
      format: 'umd',
      globals: {
        '@popperjs/core': 'Popper',
      },
    },
    minify: false,
  },
  {
    output: {
      name: 'PopperDOM',
      file: `dist/${NAME}.min.js`,
      format: 'umd',
      globals: {
        '@popperjs/core': 'Popper',
      },
    },
    minify: true,
  },
].map(({ output, minify }) => ({
  input: 'src/index.js',
  output,
  external: ['@popperjs/core'],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    replace({
      __DEV__: 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    minify && terser(),
  ],
}));

export default process.env.NODE_ENV === 'build' ? buildExport : devExport;
