import base from './rollup.config.base.js';
import babel from 'rollup-plugin-babel';

export default Object.assign(base, {
    plugins: [
        babel({
            presets: [
                ['es2015', { modules: false }],
                'stage-2',
            ],
        }),
    ],
});
