import path from 'path';
import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

const input = path.join(__dirname, 'src/index.ts');

const bundles = [
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/floating-ui.react-native.esm.js'),
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/floating-ui.react-native.esm.min.js'),
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIReactNative',
      file: path.join(__dirname, 'dist/floating-ui.react-native.js'),
      format: 'umd',
      globals: {
        react: 'React',
        'react-native': 'ReactNative',
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIReactNative',
      file: path.join(__dirname, 'dist/floating-ui.react-native.min.js'),
      format: 'umd',
      globals: {
        react: 'React',
        'react-native': 'ReactNative',
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
];

const buildExport = bundles.map(({input, output}) => ({
  input,
  output,
  external: ['react', 'react-native', '@floating-ui/core'],
  plugins: [
    commonjs(),
    nodeResolve({extensions: ['.ts']}),
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

export default buildExport;
