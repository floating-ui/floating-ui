import commonjs from '@rollup/plugin-commonjs';
import summary from 'rollup-plugin-summary';
import withSolid from 'rollup-preset-solid';

export default withSolid({
  input: 'src/index.ts',
  targets: ['esm', 'cjs'],
  watch: {},
  plugins: [summary({showGzippedSize: true}), commonjs()],
  treeshake: true,
});
