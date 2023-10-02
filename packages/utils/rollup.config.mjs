import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const bundles = [
  // Core
  {
    input: './src/index.ts',
    output: {
      file: './dist/floating-ui.utils.esm.js',
      format: 'esm',
    },
  },
  {
    input: './src/index.ts',
    output: {
      file: './dist/floating-ui.utils.mjs',
      format: 'esm',
    },
  },
  {
    input: './src/index.ts',
    output: {
      file: './dist/floating-ui.utils.umd.js',
      name: 'FloatingUIUtils',
      format: 'umd',
      globals: {
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
  // DOM
  {
    input: './dom/src/index.ts',
    output: {
      file: './dom/dist/floating-ui.utils.dom.esm.js',
      format: 'esm',
    },
  },
  {
    input: './dom/src/index.ts',
    output: {
      file: './dom/dist/floating-ui.utils.dom.mjs',
      format: 'esm',
    },
  },
  {
    input: './dom/src/index.ts',
    output: {
      file: './dom/dist/floating-ui.utils.dom.umd.js',
      name: 'FloatingUIUtilsDOM',
      format: 'umd',
    },
  },
  // React
  {
    input: './react/src/index.ts',
    output: {
      file: './react/dist/floating-ui.utils.react.esm.js',
      format: 'esm',
    },
  },
  {
    input: './react/src/index.ts',
    output: {
      file: './react/dist/floating-ui.utils.react.mjs',
      name: 'FloatingUIUtilsReact',
      format: 'esm',
    },
  },
  {
    input: './react/src/index.ts',
    output: {
      file: './react/dist/floating-ui.utils.react.umd.js',
      name: 'FloatingUIUtilsReact',
      format: 'umd',
      globals: {
        '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
      },
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  external: [
    '@floating-ui/core',
    '@floating-ui/utils',
    '@floating-ui/utils/dom',
    '@floating-ui/utils/react',
  ],
  plugins: [
    nodeResolve({extensions: ['.ts']}),
    replace({
      __DEV__:
        output.file.includes('.browser.') || output.file.includes('.umd.')
          ? output.file.includes('.min.')
            ? 'false'
            : 'true'
          : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      plugins: ['annotate-pure-calls'],
    }),
    output.file.includes('.min.') && terser(),
  ],
}));
