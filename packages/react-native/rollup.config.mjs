import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const input = './src/index.ts';

const bundles = [
  {
    input,
    output: {
      file: './dist/floating-ui.react-native.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIReactNative',
      file: './dist/floating-ui.react-native.js',
      format: 'cjs',
      globals: {
        react: 'React',
        'react-native': 'ReactNative',
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  external: ['react', 'react-native', '@floating-ui/core'],
  plugins: [
    commonjs(),
    nodeResolve({extensions: ['.ts', '.js']}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
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
