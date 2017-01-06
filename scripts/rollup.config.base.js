import babel from 'rollup-plugin-babel';

export default {
    format: 'umd',
    sourceMap: true,
    plugins: [babel()],
}
