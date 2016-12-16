import base from './rollup.config.base.js';

const root = `${__dirname}/..`;

export default Object.assign(base, {
    entry: `${root}/src/tooltip/index.js`,
    dest: `${root}/build/tooltip.js`,
    moduleName: 'Tooltip',
    sourceMapFile: `${root}/build/tooltip.js.map`,
    banner: require('./addTooltipHeader.js')(),
});
