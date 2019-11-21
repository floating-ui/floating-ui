import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const IS_DEV = process.env.NODE_ENV === 'development';
const dir = IS_DEV ? 'tests/visual/dist' : 'dist';

const umdBundle = minify => ({
  input: 'src/index.js',
  plugins: [
    babel(),
    replace({
      __DEV__: "process.env.NODE_ENV !== 'production'",
    }),
    minify && terser(),
    bundleSize(),
  ].filter(Boolean),
  output: {
    name: 'Popper',
    file: `${dir}/umd/index${minify ? '.min' : ''}.js`,
    format: 'umd',
    sourcemap: true,
  },
});

const esBundle = minify => ({
  input: 'src/index.js',
  plugins: [
    babel(),
    replace({
      __DEV__: "process.env.NODE_ENV !== 'production'",
    }),
    minify && terser(),
    bundleSize(),
  ].filter(Boolean),
  output: {
    name: 'Popper',
    file: `${dir}/es/index${minify ? '.min' : ''}.js`,
    format: 'es',
    sourcemap: true,
  },
});

const cjsBundle = minify => ({
  input: 'src/index.js',
  plugins: [
    babel(),
    replace({
      __DEV__: "process.env.NODE_ENV !== 'production'",
    }),
    minify && terser(),
    bundleSize(),
  ].filter(Boolean),
  output: {
    file: `${dir}/cjs/index${minify ? '.min' : ''}.js`,
    format: 'cjs',
    sourcemap: true,
  },
});

const devBundle = () => ({
  input: 'src/index.js',
  plugins: [
    babel(),
    replace({
      __DEV__: 'true',
    }),
  ],
  output: {
    name: 'Popper',
    file: `${dir}/es/index.js`,
    format: 'es',
    sourcemap: true,
  },
});

const builds = IS_DEV
  ? [devBundle()]
  : [
      umdBundle(),
      umdBundle(true),
      esBundle(),
      esBundle(true),
      cjsBundle(),
      cjsBundle(true),
    ];

export default builds;
