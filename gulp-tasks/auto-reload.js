'use strict';

var spawn = require('child_process').spawn;

// Run this when you're working on the Gulpfile. Otherwise, do not use.
module.exports = function (gulp) {
  return function () {
    var process;
    var args = ['default'];

    function restart() {
      if (process) {
        process.kill();
      }

      process = spawn('gulp', args, { stdio: 'inherit' });
    }

    gulp.watch('gulpfile.js', restart);
    restart();

    args.push('--no-open');
  };
};
