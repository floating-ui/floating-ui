import babel from 'rollup-plugin-babel';

export default {
    format: 'umd',
    sourceMap: true,
    plugins: [babel()],
    globals: {
        'popper.js': 'Popper',
        'tooltip.js': 'Tooltip',
    },
}
