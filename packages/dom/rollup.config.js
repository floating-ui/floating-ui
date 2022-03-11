import path from 'path';
import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';

const input = path.join(__dirname, 'src/index.ts');

const bundles = [
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/floating-ui.dom.esm.js'),
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/floating-ui.dom.esm.min.js'),
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/floating-ui.dom.esm.development.js'),
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIDOM',
      file: path.join(__dirname, 'dist/floating-ui.dom.js'),
      format: 'umd',
      globals: {
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
  {
    input,
    output: {
      name: 'FloatingUIDOM',
      file: path.join(__dirname, 'dist/floating-ui.dom.min.js'),
      format: 'umd',
      globals: {
        '@floating-ui/core': 'FloatingUICore',
      },
    },
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/floating-ui.dom.cjs'),
      format: 'cjs',
    },
  },
];

const isDevEnv = (file) => file.includes('.development.');
const isUMD = (file) => file.includes('.dom.js');
const isMinEnv = (file) => file.includes('.min.');
const isSpecificEnv = (file) => isMinEnv(file) || isDevEnv(file);
const isDebugAlways = (file) =>
  isDevEnv(file) || isUMD(file) ? 'true' : 'false';

const buildExport = bundles.map(({input, output}) => ({
  input,
  output,
  external: ['@floating-ui/core'],
  plugins: [
    nodeResolve({extensions: ['.ts']}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      plugins: ['annotate-pure-calls'],
    }),
    replace({
      __DEV__: isSpecificEnv(output.file)
        ? isDebugAlways(output.file)
        : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    output.file.includes('.min.') && terser(),
  ],
}));

const devExport = {
  input: path.join(__dirname, 'src/index.ts'),
  output: {
    file: path.join(__dirname, `dist/floating-ui.dom.esm.js`),
    format: 'esm',
  },
  plugins: [
    nodeResolve({extensions: ['.ts']}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      plugins: ['annotate-pure-calls'],
    }),
    replace({
      'process.env.NODE_ENV': '"development"',
      __DEV__: 'true',
      preventAssignment: true,
    }),
  ],
};

export default process.env.NODE_ENV === 'build' ? buildExport : devExport;
