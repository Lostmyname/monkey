'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

gulp.task('sass', function () {
  return gulp.src(['assets/sass/*.{sass,scss}', '!assets/sass/_*.{sass,scss}'])
    .pipe(plugins.rubySass())
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer())
//		.pipe(plugins.minifyCss())
    .pipe(gulp.dest('assets/css'));
});

gulp.task('browser-sync', function () {
  browserSync.init([
    'assets/css/*.css',
    'assets/**/*.css',
    'assets/**/*.js',
    'assets/imgs/**/*.jpg',
    'assets/imgs/**/*.png',
    '**/*.html'
  ], {
    server: {
      baseDir: '.'
    },
    ghostMode: {
      scroll: true,
      links: true,
      forms: true
    }
  });
});

gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch('assets/**/*.{sass,scss}', ['sass']);
});
