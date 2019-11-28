import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const IS_DEV =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
const dir = IS_DEV ? 'tests/visual/dist' : 'dist';

const inputs = ['src/popper.js', 'src/popper-lite.js', 'src/popper-base.js'];

const getFileName = input => input.split('/')[1].split('.')[0];

const createUmdBundle = ({ input, minify } = {}) => ({
  input,
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
    file: `${dir}/umd/${getFileName(input)}${minify ? '.min' : ''}.js`,
    format: 'umd',
    sourcemap: true,
  },
});

const createEsmBundle = ({ input }) => ({
  input: 'src/index.js',
  plugins: [babel(), bundleSize()],
  output: {
    name: 'Popper',
    file: `${dir}/esm/${getFileName(input)}.js`,
    format: 'esm',
    sourcemap: true,
  },
});

const createCjsBundle = ({ input }) => ({
  input,
  plugins: [babel(), bundleSize()],
  output: {
    file: `${dir}/cjs/${getFileName(input)}.js`,
    format: 'cjs',
    sourcemap: true,
  },
});

const createDevBundle = ({ input }) => ({
  input,
  plugins: [
    babel(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  output: {
    name: 'Popper',
    file: `${dir}/esm/${getFileName(input)}.js`,
    format: 'esm',
    sourcemap: true,
  },
});

const builds = IS_DEV
  ? [createDevBundle({ input: 'src/popper.js' })]
  : inputs
      .map(input => [
        createUmdBundle({ input }),
        createUmdBundle({ input, minify: true }),
        createEsmBundle({ input }),
        createCjsBundle({ input }),
      ])
      .flat();

export default builds;
