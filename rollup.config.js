import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import license from 'rollup-plugin-license';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import flowEntry from 'rollup-plugin-flow-entry';
import pkg from './package.json';

const IS_DEV = process.env.NODE_ENV === 'development';
const dir = IS_DEV ? 'tests/visual/dist' : 'dist';

const inputs = ['src/popper.js', 'src/popper-lite.js', 'src/popper-base.js'];

const getFileName = input => input.split('/')[1].split('.')[0];

const banner = license({ banner: `@popperjs/core v${pkg.version}` });

const createUmdBundle = ({ input, minify } = {}) => ({
  input,
  plugins: [
    replace({
      __DEV__: minify ? 'false' : 'true',
    }),
    babel(),
    sizeSnapshot({ printInfo: false }),
    minify && terser(),
    banner,
    flowEntry(),
    bundleSize(),
    visualizer({
      sourcemap: true,
      filename: `stats/${getFileName(input)}${minify ? '-min' : ''}.html`,
    }),
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
  plugins: [babel(), banner, bundleSize()],
  output: {
    name: 'Popper',
    file: `${dir}/esm/${getFileName(input)}.js`,
    format: 'esm',
    sourcemap: true,
  },
});

const createCjsBundle = ({ input }) => ({
  input,
  plugins: [babel(), banner, bundleSize()],
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
    banner,
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
