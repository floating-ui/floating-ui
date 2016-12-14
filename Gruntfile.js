'use strict';

var grunt = require('grunt');
var fs = require('fs');
var path = require('path');
var babel = require('rollup-plugin-babel');

var popperVersion = JSON.parse(fs.readFileSync('./package.json')).version;
var tooltipVersion = JSON.parse(fs.readFileSync('./src/tooltip/package.json')).version;

// comma separated list of browsers to run tests inside
var browsers = grunt.option('browsers') ? grunt.option('browsers').split(',') : ['ChromeDebug'];
var babelOptions = { exclude: './node_modules/**' };

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-jsdoc-to-markdown')
grunt.loadNpmTasks('grunt-karma');
grunt.loadNpmTasks('grunt-banner');
grunt.loadNpmTasks('grunt-rollup');
grunt.loadNpmTasks('gruntify-eslint');

module.exports = function Gruntfile(grunt) {
    // Project configuration.
    grunt.initConfig({
        rollup: {
            options: {
                format: 'umd',
                sourceMap: true,
                plugins: function() {
                    return [
                        babel(babelOptions)
                    ];
                }
            },
            popper: {
                options: {
                    moduleName: 'Popper',
                    sourceMapFile: 'build/popper.js.map',
                },
                files: {
                    'build/popper.js': ['src/popper/index.js']
                }
            },
            'popperTmp': {
                options: {
                    moduleName: 'Popper',
                    sourceMapFile: 'build/popper.js.map',
                },
                files: {
                    '.tmp/popper.js': ['src/popper/index.js']
                }
            },
            tooltip: {
                options: {
                    moduleName: 'Tooltip',
                    sourceMapFile: 'build/tooltip.js.map',
                },
                files: {
                    'build/tooltip.js': ['src/tooltip/index.js']
                }
            },
            'tooltipTmp': {
                options: {
                    moduleName: 'Tooltip',
                    sourceMapFile: 'build/tooltip.js.map',
                },
                files: {
                    '.tmp/tooltip.js': ['src/tooltip/index.js']
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                preserveComments: /(?:license|version)/,
                mangleToplevel: true,
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true
                }
            },
            popper: {
                sourceMapIn: 'build/popper.min.js.map',
                sourceMapName: 'build/popper.min.js.map',
                files: {
                    'build/popper.min.js': ['build/popper.js']
                }
            },
            tooltip: {
                sourceMapIn: 'build/tooltip.min.js.map',
                sourceMapName: 'build/tooltip.min.js.map',
                files: {
                    'build/tooltip.min.js': ['build/tooltip.js']
                }
            }
        },
        jsdoc2md: {
            popper: {
                src: '.tmp/popper.js',
                dest: 'doc/_includes/popper-documentation.md',
            },
            tooltip: {
                src: '.tmp/tooltip.js',
                dest: 'doc/_includes/tooltip-documentation.md',
            },
        },
        karma: {
            options: {
                frameworks: ['jasmine'],
                singleRun: true,
                browsers: browsers,
                autoWatch: true,
                customLaunchers: {
                    ChromeDebug: {
                        base: 'Chrome',
                        chromeDataDir: path.resolve(__dirname, '.chrome')
                    },
                    SLChrome: {
                        base: 'SauceLabs',
                        browserName: 'chrome',
                        platform: 'OS X 10.11'
                    },
                    SLFirefox: {
                        base: 'SauceLabs',
                        browserName: 'firefox',
                        platform: 'OS X 10.11'

                    },
                    SLEdge: {
                        base: 'SauceLabs',
                        browserName: 'microsoftedge'
                    },
                    SLSafari: {
                        base: 'SauceLabs',
                        browserName: 'safari',
                        platform: 'OS X 10.11'
                    },
                    SLInternetExplorer10: {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        version: '10'
                    },
                    SLInternetExplorer11: {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        version: '11'
                    }
                },
                preprocessors: {
                    'tests/**/*.js': ['rollup']
                },
                rollupPreprocessor: {
                    plugins: [
                        babel(babelOptions)
                    ],
                    format: 'iife',
                    sourceMap: 'inline'
                },
                files: [
                    'tests/styles/*.css',
                    'tests/functional/*.js',
                    'tests/unit/*.js',
                ],
                sauceLabs: {
                    testName: 'Popper.js',
                    startConnect: false,
                    tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
                },
                reporters: ['dots', 'saucelabs']
            },
            ci: {},
            local: {
                singleRun: false,
            }
        },
        eslint: {
            options: {

            },
            src: ['src/**/*.js'],
            test: ['tests/**/*.js']
        },
        usebanner: {
            options: {
                position: 'top',
            },
            popper: {
                options: {
                    banner: `\
/*
* @fileOverview Kickass library to create and place poppers near their reference elements.
* @version ${popperVersion}
${license}
*/\
                    `,
                },
                files: {
                    src: [ 'build/popper.js', 'build/popper.min.js' ],
                },
            },
            tooltip: {
                options: {
                    banner: `\
/*
* @fileOverview Kickass library to create tooltips in your applications.
* @version ${tooltipVersion}
${license}
*/\
                    `,
                },
                files: {
                    src: [ 'build/tooltip.js', 'build/tooltip.min.js' ]
                },
            },
        },
    });

    grunt.registerTask('doc', ['eslint', 'rollup:popperTmp', 'rollup:tooltipTmp', 'jsdoc2md']);
    grunt.registerTask('dist:popper', [ 'eslint', 'rollup:popper', 'usebanner:popper', 'uglify:popper']);
    grunt.registerTask('dist:tooltip', [ 'eslint', 'rollup:tooltip', 'usebanner:tooltip', 'uglify:tooltip']);
    grunt.registerTask('dist', [ 'dist:popper', 'dist:tooltip']);
    grunt.registerTask('test', ['eslint', 'karma:local']);
    grunt.registerTask('test-ci', ['eslint', 'karma:ci']);
};


var license = `\
* @license
* Copyright (c) 2016 Federico Zivolo and contributors
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.`;
