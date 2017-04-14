import base from './rollup.config.base.js';

const root = `${__dirname}/..`;

export default Object.assign(base, {
  entry: `${root}/src/tooltip/index.js`,
  dest: `${root}/dist/tooltip.js`,
  moduleName: 'Tooltip',
  sourceMapFile: `${root}/dist/tooltip.js.map`,
  banner: require('./addTooltipHeader.js')(),
  external: ['popper.js'],
  globals: {
    'popper.js': 'Popper',
  },
});
