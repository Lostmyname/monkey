'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var getLmnTask = require('lmn-gulp-tasks');

gulp.task('auto-reload', getLmnTask('auto-reload', {
  addArgs: ['--no-open']
}));

gulp.task('html', getLmnTask('html', {
  langBase: 'component.monkey',
  imagePath: '../../src/imgs/'
}));

gulp.task('js', ['js-quality'], getLmnTask('browserify', {
  src: './src/js/monkey.js',
  dest: './build/monkey.js'
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
gulp.task('default', ['build'], function () {
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
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/partials/partial.erb.html', ['html']);
  gulp.watch('./demo/base.erb.html', ['html']);
});
