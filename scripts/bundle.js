const { exec, execSync } = require('child_process');
const { waterfall } = require('async');
const { argv } = require('yargs');
const colors = require('colors');
const { build } = argv;

const rollup = 'rollup -c ./scripts/rollup.config.js';
const minify = 'node ./scripts/minify.js';
const gzipped = '$(npm bin)/gzipped';

console.log(colors.green(`⚙️  Compiling target '${build}'...`));
const next = done =>
  exec(`${rollup} --environment BUILD:${build}`, error => {
    if (error) {
      console.error(`${build}: ${error}`);
    }
    exec(`${minify} -i ./dist/${build}.js -o ./dist/${build}.min.js`, error => {
      if (error) {
        console.error(`${build}.minify: ${error}`);
      }
      console.info(
        colors.yellow(`${build}`),
        `\n${execSync(`${gzipped} ./dist/${build}.js`).toString()}`
      );
      console.info(
        colors.yellow(`${build}.min`),
        `\n${execSync(`${gzipped} ./dist/${build}.min.js`).toString()}`
      );
      done();
    });
  });

const es5 = done =>
  exec(`${rollup} --environment BUILD:${build},ES5`, error => {
    if (error) {
      console.error(`${build}.es5: ${error}`);
    }
    exec(
      `${minify} -i ./dist/${build}.es5.js -o ./dist/${build}.es5.min.js`,
      error => {
        if (error) {
          console.error(`${build}.es5.minify: ${error}`);
        }
        console.info(
          colors.yellow(`${build}.es5`),
          `\n${execSync(`${gzipped} ./dist/${build}.es5.js`).toString()}`
        );
        console.info(
          colors.yellow(`${build}.es5.min`),
          `\n${execSync(`${gzipped} ./dist/${build}.es5.min.js`).toString()}`
        );
        done();
      }
    );
  });

waterfall([next, es5], error => {
  if (error) {
    console.error(`${build}: ${error}`);
  }
});
