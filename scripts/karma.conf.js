const { argv } = require('yargs');
const path = require('path');
const babel = require('rollup-plugin-babel');

const browsers = (argv.browsers || process.env.BROWSERS || 'Chrome').split(',');
const singleRun = process.env.NODE_ENV === 'development' ? false : true;
const coverage = process.env.NODE_ENV === 'coverage';
const root = `${__dirname}/..`;

module.exports = function(config) {
  const configuration = {
    frameworks: ['jasmine', 'chai', 'sinon'],
    singleRun,
    browserNoActivityTimeout: 60000,
    browserDisconnectTolerance: 10,
    browsers: browsers,
    autoWatch: true,
    customLaunchers: {
      ChromeDebug: {
        base: 'Chrome',
        chromeDataDir: path.resolve(__dirname, '.chrome'),
      },
      SLChrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
      },
      SLFirefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'macOS 10.12',
      },
      SLEdge: {
        base: 'SauceLabs',
        browserName: 'microsoftedge',
      },
      SLSafari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'macOS 10.12',
      },
      SLInternetExplorer10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '10',
        platform: 'Windows 8',
      },
      SLInternetExplorer11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '11',
        platform: 'Windows 10',
      },
      SLiOS9: {
        base: 'SauceLabs',
        browserName: 'iphone',
        version: '9.3',
        platform: 'macOS 10.12',
      },
      SLChromeMobile: {
        base: 'SauceLabs',
        browserName: 'Chrome',
        appiumVersion: '1.6.3',
        platformVersion: '7.0',
        platformName: 'Android',
        deviceName: 'Android GoogleAPI Emulator',
      },
    },
    preprocessors: {
      [`${root}/src/(!dist|**)/*.js`]: ['rollup'],
      [`${root}/tests/**/*.js`]: ['rollup'],
    },
    rollupPreprocessor: {
      moduleName: 'test',
      exports: 'named',
      format: 'umd',
      sourceMap: 'inline',
      globals: {
        chai: 'chai',
      },
      external: ['chai'],
      plugins: [
        babel({
          presets: [['es2015', { modules: false }], 'stage-2'],
          plugins: [
            [
              'module-resolver',
              {
                alias: {
                  'popper.js': './src/popper/index.js',
                  src: './src',
                },
              },
            ],
          ],
        }),
      ],
    },
    files: [
      { pattern: `${root}/src/**/*.js`, included: false, watched: true },
      `${root}/tests/styles/*.css`,
      `${root}/tests/functional/*.js`,
      `${root}/tests/unit/*.js`,
    ],
    sauceLabs: {
      testName: 'Popper.js',
      startConnect: false,
      recordVideo: true,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
    },
    reporters: ['dots', 'saucelabs'],
  };

  if (coverage) {
    configuration.preprocessors[`${root}/src/(!dist|**)/*.js`] = ['coverage'];
    configuration.coverageReporter = {
      dir: `${root}/.tmp/coverage`,
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
      ],
    };
    configuration.reporters.push('coverage');
  }

  config.set(configuration);
};
