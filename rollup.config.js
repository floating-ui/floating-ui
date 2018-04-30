import babel from 'rollup-plugin-babel';

const dir =
  process.env.NODE_ENV !== 'production' ? 'tests/visual/dist' : 'dist';

export default [
  {
    input: 'src/index.js',
    plugins: [babel()],
    output: {
      name: 'Popper',
      file: 'popper.js',
      file: `${dir}/umd/popper.js`,
      format: 'es',
      sourcemap: true,
    },
  },
  {
    input: 'src/index.js',
    plugins: [babel()],
    output: {
      name: 'Popper',
      file: `${dir}/cjs/popper.js`,
      format: 'cjs',
      sourcemap: true,
    },
  },
];
