const argv = require('yargs').argv;
const path = require('path');
const babel = require('rollup-plugin-babel');
const browsers = (argv.browsers || process.env.BROWSERS || 'Chrome').split(',');
const singleRun = process.env.NODE_ENV === 'development' ? false : true;

const root = `${__dirname}/..`;

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        singleRun,
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
                platform: 'OS X 10.11',
            },
            SLFirefox: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11',
            },
            SLEdge: {
                base: 'SauceLabs',
                browserName: 'microsoftedge',
            },
            SLSafari: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.11',
            },
            SLInternetExplorer10: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: '10',
            },
            SLInternetExplorer11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: '11',
            }
        },
        preprocessors: {
            [`${root}/tests/**/*.js`]: ['rollup'],
        },
        rollupPreprocessor: {
            plugins: [babel()],
            format: 'iife',
            sourceMap: 'inline',
        },
        files: [
            { pattern:`${root}/src/**/*.js`, included: false, watched: true },
            `${root}/tests/styles/*.css`,
            `${root}/tests/functional/*.js`,
            `${root}/tests/unit/*.js`,
        ],
        sauceLabs: {
            testName: 'Popper.js',
            startConnect: false,
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        },
        reporters: ['dots', 'saucelabs'],
    });
};
