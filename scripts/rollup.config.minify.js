import babili from 'rollup-plugin-real-babili';

export default {
    plugins: [
        babili({
            comments: false,
            minified: true,
            compact: true,
        }),
    ],
}
