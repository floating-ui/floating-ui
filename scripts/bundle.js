const { exec, execSync } = require('child_process');
const { parallel } = require('async');
const { argv } = require('yargs');
const colors = require('colors');
const { build } = argv;

const rollup = 'rollup -c ./scripts/rollup.config.js';
const minify = 'node ./scripts/minify.js';
const gzipped = 'gzipped';

const bundleFactory = (es5, ext, format) => done => {
  const ES5 = es5 || false;
  const EXT = ext || '';
  const FORMAT = format || 'es';
  const TARGET = `${EXT ? EXT + '/' : ''}${build}`;

  exec(
    `${rollup} --environment BUILD:${build},EXT:"${EXT}",FORMAT:${FORMAT}${ES5 ? ',ES5' : ''}`,
    error => {
      if (error) {
        return console.error(`${TARGET}: ${error}`);
      }
      exec(
        `${minify} -i ./dist/${EXT}/${build}.js -o ./dist/${EXT}/${build}.min.js`,
        error => {
          if (error) {
            return console.error(`${build}${EXT}.minify: ${error}`);
          }
          console.info(
            colors.yellow(`${TARGET}`),
            `\n${execSync(`${gzipped} ./dist/${EXT}/${build}.js`).toString()}`
          );
          console.info(
            colors.yellow(`${TARGET}.min`),
            `\n${execSync(`${gzipped} ./dist/${EXT}/${build}.min.js`).toString()}`
          );
          done();
        }
      );
    }
  );
};

const umd_es5 = bundleFactory(true, 'umd', 'umd');
const esm_es5 = bundleFactory(true, 'esm', 'es');
const esm_es6 = bundleFactory(false, '', 'es');

console.info(colors.green(`⚙️  Compiling target '${build}'...`));
parallel([umd_es5, esm_es5, esm_es6], error => {
  if (error) {
    console.error(`${build}: ${error}`);
  }
});
