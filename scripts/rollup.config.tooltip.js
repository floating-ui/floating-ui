import path from 'path';
import deepAssign from 'deep-assign';
import base from './rollup.config.base.js';

const root = `${__dirname}/..`;

export default deepAssign(base, {
    entry: `${root}/src/tooltip/index.js`,
    dest: `${root}/build/tooltip.js`,
    moduleName: 'Tooltip',
    sourceMapFile: `${root}/build/tooltip.js.map`,
    banner: require('./addTooltipHeader.js')(),
    external: [path.resolve(root, 'src/popper/index.js')]
});
