import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import summary from 'rollup-plugin-summary';
import withSolid from 'rollup-preset-solid';

export default withSolid({
  input: 'src/index.ts',
  targets: ['esm', 'cjs'],
  watch: {},
  printInstructions: true,
  plugins: [
    summary({showGzippedSize: true}),
    replace({
      __DEV__: 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    commonjs(),
  ],
  treeshake: true,
});
