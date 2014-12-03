'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var stylish = require('jshint-stylish');

var dieOnError = true;

gulp.task('js-quality', function () {
  var stream = gulp.src('js/**/*.js');

  if (!dieOnError) {
    stream = stream.pipe(plugins.plumber());
  }

  stream = stream.pipe(plugins.jscs())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish));

  if (dieOnError) {
    stream = stream.pipe(plugins.jshint.reporter('fail'));
  }

  return stream;
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
//    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('default', ['js', 'sass'], function () {
  dieOnError = false;

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

  gulp.watch('sass/**/*.{sass,scss}', ['sass']);

  // Watching heidelberg file in case of npm link
  gulp.watch([
    'js/**/*.js',
    'node_modules/heidelberg/js/heidelberg/heidelberg.js'
  ], ['js']);
});
