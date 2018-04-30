import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

const dir = process.env.NODE_ENV === 'test' ? 'tests/visual/dist' : 'dist';

export default [
  {
    input: 'src/index.js',
    plugins: [
      babel(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
    ],
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
    plugins: [
      babel(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
    ],
    output: {
      file: `${dir}/cjs/popper.js`,
      format: 'cjs',
      sourcemap: true,
    },
  },
  {
    input: 'src/index.js',
    plugins: [
      babel(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
    ],
    output: {
      file: `${dir}/es/popper.js`,
      format: 'es',
      sourcemap: true,
    },
  },
];
