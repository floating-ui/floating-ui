import babel from 'rollup-plugin-babel';

const ROOT = `${__dirname}/..`;
const ES5 = process.env.ES5;
const BUILD = process.env.BUILD;
const EXT = process.env.EXT || '';
const FORMAT = process.env.FORMAT || 'es';

const babelConfig = ES5
  ? {
    presets: [['es2015', { modules: false }], 'stage-2'],
  }
  : {
    presets: ['stage-2'],
  };

let entry, dest, moduleName, sourceMapFile;
switch (BUILD) {
  case 'popper':
    moduleName = 'Popper';
    entry = `${ROOT}/src/popper/index.js`;
    dest = `${ROOT}/dist/${EXT}/popper.js`;
    sourceMapFile = `${ROOT}/dist/${EXT}/popper.js.map`;
    break;
  case 'popper-utils':
    moduleName = 'PopperUtils';
    entry = `${ROOT}/src/popper/utils/index.js`;
    dest = `${ROOT}/dist/${EXT}/popper-utils.js`;
    sourceMapFile = `${ROOT}/dist/${EXT}/popper-utils.js.map`;
    break;
  case 'tooltip':
    moduleName = 'Tooltip';
    entry = `${ROOT}/src/tooltip/index.js`;
    dest = `${ROOT}/dist/${EXT}/tooltip.js`;
    sourceMapFile = `${ROOT}/dist/${EXT}/tooltip.js.map`;
    break;
}

export default {
  entry,
  dest,
  moduleName,
  format: FORMAT,
  sourceMap: true,
  sourceMapFile,
  plugins: [babel(babelConfig)],
};
