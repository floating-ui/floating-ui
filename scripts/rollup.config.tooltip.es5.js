import tooltip from './rollup.config.tooltip';
import es5 from './rollup.config.es5';

const root = `${__dirname}/..`;

export default Object.assign(tooltip, es5, {
  dest: `${root}/dist/tooltip.es5.js`,
  sourceMapFile: `${root}/dist/tooltip.es5.js.map`,
});
