import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import withSolid from 'rollup-preset-solid';

const input = './src/index.ts';

const bundles = [
  {
    input,
    output: {
      file: './dist/floating-ui.solid.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.solid.esm.min.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      name: 'FloatingUISolid',
      file: './dist/floating-ui.solid.umd.js',
      format: 'umd',
      globals: {
        'solid-js': 'solidjs',
        '@floating-ui/core': 'FloatingUICore',
        '@floating-ui/dom': 'FloatingUIDOM',
      },
    },
  },
  {
    input,
    output: {
      name: 'FloatingUISolid',
      file: './dist/floating-ui.solid.umd.min.js',
      format: 'umd',
      globals: {
        'solid-js': 'solidjs',
        '@floating-ui/core': 'FloatingUICore',
        '@floating-ui/dom': 'FloatingUIDOM',
      },
    },
  },
  {
    input,
    output: {
      file: './dist/floating-ui.solid.mjs',
      format: 'esm',
    },
  },
];

export default withSolid(
  bundles.map(({input, output}) => ({
    input,
    output,
    external: ['solid', '@floating-ui/core', '@floating-ui/dom'],
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
  }))
);
