import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const input = './src/index.ts';

const bundles = [
  // Utils sub-path
  {
    input: './utils/src/index.ts',
    output: {
      file: './utils/dist/floating-ui.react.utils.esm.js',
      format: 'esm',
    },
  },
  {
    input: './utils/src/index.ts',
    output: {
      file: './utils/dist/floating-ui.react.utils.mjs',
      name: 'FloatingUIReactUtils',
      format: 'esm',
    },
  },
  {
    input: './utils/src/index.ts',
    output: {
      file: './utils/dist/floating-ui.react.utils.umd.js',
      name: 'FloatingUIReactUtils',
      format: 'umd',
      globals: {
        '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
      },
    },
  },

  // Main
  {
    input,
    output: {
      file: './dist/floating-ui.react.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.react.esm.min.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIReact',
      file: './dist/floating-ui.react.umd.js',
      format: 'umd',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'aria-hidden': 'ariaHidden',
        tabbable: 'tabbable',
        '@floating-ui/core': 'FloatingUICore',
        '@floating-ui/dom': 'FloatingUIDOM',
        '@floating-ui/react-dom': 'FloatingUIReactDOM',
        '@floating-ui/utils': 'FloatingUIUtils',
        '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
        '@floating-ui/react/utils': 'FloatingUIReactUtils',
      },
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIReact',
      file: './dist/floating-ui.react.umd.min.js',
      format: 'umd',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'aria-hidden': 'ariaHidden',
        tabbable: 'tabbable',
        '@floating-ui/core': 'FloatingUICore',
        '@floating-ui/dom': 'FloatingUIDOM',
        '@floating-ui/react-dom': 'FloatingUIReactDOM',
        '@floating-ui/utils': 'FloatingUIUtils',
        '@floating-ui/utils/dom': 'FloatingUIUtilsDOM',
        '@floating-ui/react/utils': 'FloatingUIReactUtils',
      },
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.react.mjs',
      format: 'esm',
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  external: [
    'react',
    'react-dom',
    '@floating-ui/core',
    '@floating-ui/dom',
    '@floating-ui/react-dom',
  ].concat(
    output.format !== 'umd'
      ? [
          'aria-hidden',
          'tabbable',
          '@floating-ui/utils',
          '@floating-ui/utils/dom',
          '@floating-ui/react/utils',
        ]
      : []
  ),
  plugins: [
    commonjs(),
    nodeResolve({extensions: ['.ts', '.tsx']}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      plugins: ['annotate-pure-calls'],
    }),
    replace({
      __DEV__: output.file.includes('.min.')
        ? 'false'
        : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    output.file.includes('.min.') && terser(),
  ],
}));
