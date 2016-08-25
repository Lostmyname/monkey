'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var getLmnTask = require('lmn-gulp-tasks');

var jsOpts = {
  src: './src/js/monkey.js',
  dest: './demo/build/bundle.js'
};
var jsOptsWatch = { src: jsOpts.src, dest: jsOpts.dest, watch: true };

gulp.task('js', getLmnTask('browserify', jsOpts));
gulp.task('js-watch', getLmnTask('browserify', jsOptsWatch));

gulp.task('js-quality', getLmnTask('js-quality', {
  src: './src/js/**/*.js'
}));

gulp.task('scss', getLmnTask('scss', {
  src: './src/scss/*.{sass,scss}',
  dest: './demo/build',
  minify: false
}));

gulp.task('build', ['js', 'scss']);
gulp.task('default', ['build', 'js-watch'], function () {
  var config = {
    server: {
      baseDir: '.'
    },
    startPath: '/demo/index.html'
  };

  browserSync.init([
    'demo/build/**/*.css',
    'demo/build/**/*.js',
    'demo/**/*.html',
    'src/imgs/**/*',
    'test/**/*.js'
  ], config);

  gulp.watch('./src/scss/**/*.{sass,scss}', ['scss']);
  gulp.watch('./src/partials/partial.erb.html', ['html']);
  gulp.watch('./demo/base.erb.html', ['html']);
});
