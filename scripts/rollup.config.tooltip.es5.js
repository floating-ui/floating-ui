import deepAssign from 'deep-assign';
import tooltip from './rollup.config.tooltip';
import es5 from './rollup.config.es5';

const root = `${__dirname}/..`;

export default deepAssign(tooltip, es5, {
    dest: `${root}/dist/tooltip.es5.js`,
    sourceMapFile: `${root}/dist/tooltip.es5.js.map`,
});
