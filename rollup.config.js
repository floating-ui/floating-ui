import babel from 'rollup-plugin-babel';

const file =
  process.env.NODE_ENV !== 'production'
    ? 'tests/visual/dist/popper.js'
    : 'dist/popper.js';

export default [
  {
    input: 'src/index.js',
    plugins: [babel()],
    output: {
      name: 'Popper',
      file,
      format: 'es',
      sourcemap: true,
    },
  },
];
