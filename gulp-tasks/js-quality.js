'use strict';

var stylish = require('jshint-stylish');

module.exports = function (gulp, plugins) {
  return function () {
    var stream = gulp.src('./src/js/**/*.js');

    if (!global.dieOnError) {
      stream = stream.pipe(plugins.plumber({ errorHandler: global.onError }));
    }

    stream = stream.pipe(plugins.jscs())
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter(stylish));

    if (global.dieOnError) {
      stream = stream.pipe(plugins.jshint.reporter('fail'));
    }

    return stream;
  };
};
