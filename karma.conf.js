module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '',
    frameworks: ['mocha'],

    files: [
      'node_modules/should/should.js',
      'assets/js/lib/**/jquery.js',
      'assets/js/lib/**/*.js',
      'assets/js/heidelberg/**/*.js',
      'assets/js/**/*.js',
      'test/**/_*.js',
      'test/**/*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'PhantomJS'],
    singleRun: false
  });
};
