import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const IS_DEV = process.env.NODE_ENV === 'development';
const dir = IS_DEV ? 'tests/visual/dist' : 'dist';

const createUmdBundle = ({ minify } = {}) => ({
  input: 'src/index.js',
  plugins: [
    replace({
      __DEV__: minify ? 'false' : 'true',
    }),
    babel(),
    minify && terser(),
    bundleSize(),
  ].filter(Boolean),
  output: {
    name: 'Popper',
    file: `${dir}/umd/popper${minify ? '.min' : ''}.js`,
    format: 'umd',
    sourcemap: true,
  },
});

const esmBundle = {
  input: 'src/index.js',
  plugins: [babel(), bundleSize()],
  output: {
    name: 'Popper',
    file: `${dir}/esm/popper.js`,
    format: 'esm',
    sourcemap: true,
  },
};

const cjsBundle = {
  input: 'src/index.js',
  plugins: [babel(), bundleSize()],
  output: {
    file: `${dir}/cjs/popper.js`,
    format: 'cjs',
    sourcemap: true,
  },
};

const devBundle = {
  input: 'src/index.js',
  plugins: [
    babel(),
    replace({
      __DEV__: 'true',
    }),
  ],
  output: {
    name: 'Popper',
    file: `${dir}/esm/popper.js`,
    format: 'esm',
    sourcemap: true,
  },
};

const builds = IS_DEV
  ? [devBundle]
  : [
      createUmdBundle(),
      createUmdBundle({ minify: true }),
      esmBundle,
      cjsBundle,
    ];

export default builds;
