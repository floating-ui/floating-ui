import deepAssign from 'deep-assign';
import base from './rollup.config.base.js';
import babel from 'rollup-plugin-babel';

export default deepAssign(base, {
    plugins: [
        babel({
            presets: [
                ['es2015', { modules: false }],
                'stage-2',
            ],
        }),
    ],
});
