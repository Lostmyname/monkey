'use strict';

module.exports = function (gulp, plugins) {
  return function () {
    return gulp.src(['./src/scss/*.{sass,scss}', '!./src/scss/_*.{sass,scss}'])
      .pipe(plugins.compass({
        css: './demo/build',
        sass: './src/scss'
      }))
      .on('error', global.onError) // For some reason gulp-plumber doesn't like -compass
      .pipe(plugins.plumber())
      .pipe(plugins.autoprefixer())
//    .pipe(plugins.minifyCss())
      .pipe(gulp.dest('./demo/build'));
  };
};
