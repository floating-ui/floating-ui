import deepAssign from 'deep-assign';
import popper from './rollup.config.popper';
import es5 from './rollup.config.es5';

const root = `${__dirname}/..`;

export default deepAssign(popper, es5, {
    dest: `${root}/dist/popper.es5.js`,
    sourceMapFile: `${root}/dist/popper.es5.js.map`,
});
