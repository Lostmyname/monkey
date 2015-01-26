'use strict';

var browserify = require('browserify');
var source = require('vinyl-source-stream');

module.exports = function (gulp, options) {
  return function () {
    var bundler = browserify(options.src);

    return bundler.bundle()
      .on('error', console.log.bind(console, 'Browserify Error'))
      .pipe(source(path.basename(options.dest)))
      .pipe(gulp.dest(path.dirname(options.dir)));
  };
};
