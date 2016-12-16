import deepAssign from 'deep-assign';
import base from './rollup.config.base.js';

const root = `${__dirname}/..`;

export default deepAssign(base, {
    entry: `${root}/src/popper/index.js`,
    dest: `${root}/build/popper.js`,
    moduleName: 'Popper',
    sourceMapFile: `${root}/build/popper.js.map`,
    banner: require('./addPopperHeader.js')(),
});
