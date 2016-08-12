'use strict';

var grunt = require('grunt');
var fs = require('fs');
var babel = require('rollup-plugin-babel');

var version = JSON.parse(fs.readFileSync('./package.json')).version;

// comma separated list of browsers to run tests inside
var browsers = grunt.option('browsers') ? grunt.option('browsers').split(',') : ['ChromeTest'];
var babelOptions = { exclude: './node_modules/**' };

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-jsdoc-to-markdown')
grunt.loadNpmTasks('grunt-karma');
grunt.loadNpmTasks('grunt-banner');
grunt.loadNpmTasks('grunt-shell-spawn');
grunt.loadNpmTasks('grunt-env');
grunt.loadNpmTasks('grunt-rollup');
grunt.loadNpmTasks('gruntify-eslint');
grunt.loadNpmTasks('grunt-gh-pages');

module.exports = function Gruntfile(grunt) {
    // Project configuration.
    grunt.initConfig({
        rollup: {
            options: {
                format: 'umd',
                moduleName: 'Popper',
                plugins: function() {
                    return [
                        babel(babelOptions)
                    ];
                }
            },
            dist: {
                files: {
                    'build/popper.js': ['src/popper.js']
                }
            },
            tmp: {
                files: {
                    '.tmp/popper.js': ['src/popper.js']
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'build/popper.min.js.map',
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
                files: {
                    'build/popper.min.js': ['build/popper.js']
                }
            }
        },
        jsdoc2md : {
            dist : {
                src: '.tmp/popper.js',
                dest: 'doc/_includes/documentation.md'
            }
        },
        'gh-pages': {
            options: {
                base: 'doc',
                branch: 'gh-pages-v1'
            },
            src: ['**']
        },
        karma: {
            options: {
                frameworks: ['jasmine'],
                singleRun: true,
                browsers: browsers,
                customLaunchers: {
                    ChromeTest: {
                        base: 'Chrome',
                        flags: ['--window-size=800,872'] // 800x800 plus karma shell
                    },
                    SLChrome: {
                        base: 'SauceLabs',
                        browserName: 'chrome'
                    },
                    SLFirefox: {
                        base: 'SauceLabs',
                        browserName: 'firefox'
                    },
                    SLEdge: {
                        base: 'SauceLabs',
                        browserName: 'microsoftedge'
                    },
                    SLSafari: {
                        base: 'SauceLabs',
                        browserName: 'safari'
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
                    'tests/setup.js',
                    'tests/functional/*.js'
                ],
                sauceLabs: {
                    testName: 'Popper.js Functional Tests',
                    startConnect: false,
                    tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
                },
                reporters: ['dots', 'saucelabs']
            },
            unit: {},
            local: {
                singleRun: false,
            }
        },
        eslint: {
            src: ['src/**/*.js'],
            test: ['tests/**/*.js']
        },
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: `
/*
* @fileOverview Kickass library to create and place poppers near their reference elements.
* @version ${version}
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
* SOFTWARE.
*/
                    `,
                },
                files: {
                    src: [ 'build/popper.js' ]
                }
            }
        },
        shell: {
            xvfb: {
                command: 'Xvfb :99 -ac -screen 0 1600x1200x24',
                options: {
                    async: true
                }
            }
        },
        env: {
            xvfb: {
                DISPLAY: ':99'
            }
        }
    });

    grunt.registerTask('doc', ['eslint', 'rollup:tmp', 'jsdoc2md']);
    grunt.registerTask('dist', [ 'eslint', 'rollup:dist', 'usebanner:dist', 'uglify:dist']);
    grunt.registerTask('test', ['eslint', 'karma:local']);
    grunt.registerTask('test-ci', ['eslint',  'shell:xvfb', 'env:xvfb', 'karma:unit', 'shell:xvfb:kill']);
};
