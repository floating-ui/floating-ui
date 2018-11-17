import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const dir = process.env.NODE_ENV === 'dev' ? 'tests/visual/dist' : 'dist';

const umdBundle = minify => ({
  input: 'src/index.js',
  plugins: [
    babel(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
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
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
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
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
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

export default [
  umdBundle(),
  umdBundle(true),
  esBundle(),
  esBundle(true),
  cjsBundle(),
  cjsBundle(true),
];
