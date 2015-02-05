'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var getLmnTask = require('lmn-gulp-tasks');

getLmnTask.setErrorHandler(function (err) {
  browserSync.notify(err.message, 3000);
  plugins.util.log(err.toString());
  this.emit('end'); // jshint ignore: line
});

gulp.task('auto-reload', getLmnTask('auto-reload', {
  addArgs: ['--no-open']
}));

gulp.task('html', getLmnTask('html'));

gulp.task('js', ['js-quality'], getLmnTask('browserify', {
  src: './src/js/monkey.js',
  dest: './demo/build/bundle.js'
}));

gulp.task('js-quality', getLmnTask('js-quality', {
  src: './src/js/**/*.js'
}));

gulp.task('scss', getLmnTask('scss', {
  src: './src/scss/*.{sass,scss}',
  dest: './demo/build',
  minify: false
}));

gulp.task('build', ['html', 'js', 'scss']);
gulp.task('default', ['build'], getLmnTask('component-default'));
