'use strict';

var browserify = require('browserify');
var source = require('vinyl-source-stream');

module.exports = function (gulp) {
  return function () {
    var bundler = browserify('./src/js/monkey.js');

    return bundler.bundle()
      .on('error', console.log.bind(console, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./demo/build'));
  };
};
