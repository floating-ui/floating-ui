import babel from 'rollup-plugin-babel';

const ROOT = `${__dirname}/..`;
const ES5 = process.env.ES5;
const BUILD = process.env.BUILD;

const babelConfig = ES5
  ? {
    presets: [['es2015', { modules: false }], 'stage-2'],
  }
  : {};
const es5Ext = ES5 ? '.es5' : '';

let entry, dest, moduleName, sourceMapFile;
switch (BUILD) {
  case 'popper':
    moduleName = 'Popper';
    entry = `${ROOT}/src/popper/index.js`;
    dest = `${ROOT}/dist/popper${es5Ext}.js`;
    sourceMapFile = `${ROOT}/dist/popper${es5Ext}.js.map`;
    break;
  case 'popper-utils':
    moduleName = 'PopperUtils';
    entry = `${ROOT}/src/popper/utils/index.js`;
    dest = `${ROOT}/dist/popper-utils${es5Ext}.js`;
    sourceMapFile = `${ROOT}/dist/popper-utils${es5Ext}.js.map`;
    break;
  case 'tooltip':
    moduleName = 'Popper';
    entry = `${ROOT}/src/tooltip/index.js`;
    dest = `${ROOT}/dist/tooltip${es5Ext}.js`;
    sourceMapFile = `${ROOT}/dist/tooltip${es5Ext}.js.map`;
    break;
}

export default {
  entry,
  dest,
  moduleName,
  format: 'umd',
  sourceMap: true,
  sourceMapFile,
  plugins: [babel(babelConfig)],
};
