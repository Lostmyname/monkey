'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

global.onError = function (err) {
  browserSync.notify(err.message, 3000);
  plugins.util.log(err.toString());
  this.emit('end'); // jshint ignore: line
};

function getTask(name, options) {
  return require('./gulp-tasks/' + name)(gulp, plugins, options);
}

gulp.task('auto-reload', getTask('auto-reload'));
gulp.task('html', getTask('html'));

gulp.task('js', ['js-quality'], getTask('js', {
  src: './src/js/monkey.js',
  dest: './demo/build/bundle.js',
  onError: global.onError
}));

gulp.task('js-quality', getTask('js-quality', {
  src: './src/js/**/*.js',
  dieOnError: false,
  onError: global.onError
}));

gulp.task('scss', getTask('scss', {
  src: './src/scss/*.{sass,scss}',
  dest: './demo/build',
  minify: false,
  onError: global.onError
}));

gulp.task('build', ['html', 'js', 'scss']);
gulp.task('default', ['build'], getTask('default'));
