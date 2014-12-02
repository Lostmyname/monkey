'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var stylish = require('jshint-stylish');

gulp.task('js-quality', function () {
  return gulp.src('js/**/*.js')
    .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('js', ['js-quality'], function () {
  var bundler = browserify('./js/monkey.js');

  return bundler.bundle()
    .on('error', console.log.bind(console, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('sass', function () {
  return gulp.src(['sass/*.{sass,scss}', '!sass/_*.{sass,scss}'])
    .pipe(plugins.rubySass())
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer())
//		.pipe(plugins.minifyCss())
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('browser-sync', function () {
  browserSync.init([
    'demo/**/*.css',
    'demo/build/**/*.js',
    'demo/*.html',
    'test/**/*.js'
  ], {
    server: {
      baseDir: '.'
    },
    startPath: '/demo/context.html',
    ghostMode: {
      scroll: false,
      links: false,
      forms: false
    }
  });
});

gulp.task('default', ['js', 'sass', 'browser-sync'], function () {
  gulp.watch('sass/**/*.{sass,scss}', ['sass']);

  // Watching heidelberg file in case of npm link
  gulp.watch([
    'js/**/*.js',
    'node_modules/heidelberg/js/heidelberg/heidelberg.js'
  ], ['js']);
});
