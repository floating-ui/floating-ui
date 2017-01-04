import popper from './rollup.config.popper';
import es5 from './rollup.config.es5';

const root = `${__dirname}/..`;

const config = Object.assign(popper, es5, {
    dest: `${root}/dist/popper.es5.js`,
    sourceMapFile: `${root}/dist/popper.es5.js.map`,
});

export default config;
