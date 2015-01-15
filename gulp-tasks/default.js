'use strict';

var browserSync = require('browser-sync');

module.exports = function (gulp) {
  return function () {
    global.dieOnError = false;

    var config = {
      server: {
        baseDir: '.'
      },
      startPath: '/demo/index.html',
      ghostMode: {
        scroll: false,
        links: false,
        forms: false
      }
    };

    if (process.argv.indexOf('--no-open') !== -1) {
      config.open = false;
    }

    browserSync.init([
      'demo/build/**/*.css',
      'demo/build/**/*.js',
      'demo/**/*.html',
      'src/imgs/**/*',
      'test/**/*.js'
    ], config);

    gulp.watch('./src/scss/**/*.{sass,scss}', ['scss']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/partials/partial.mustache.html', ['html']);
  };
};
