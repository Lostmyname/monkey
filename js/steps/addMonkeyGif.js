'use strict';

/**
 * Adds an amazing monkey gif!
 */
module.exports = function (minimumTime) {
  var preload = this.helpers.preload;

  return function (data) {
    if (data.monkeyType !== 'mobile') {
      return data;
    }

    if (typeof minimumTime !== 'number') {
      minimumTime = 2000;
    }

    return preload(data.monkeySwipe)
      .then(delayUntil(minimumTime))
      .then(function ($amazingMonkeyGif) {
        $amazingMonkeyGif.hide().fadeIn();

        data.monkeyGif = $('<div />')
          .addClass('monkey-gif')
          .append($amazingMonkeyGif)
          .appendTo(data.html.find('.heidelberg-tapToOpen'));

        data.html.one('scroll', function () {
          $amazingMonkeyGif.fadeOut();
        });

        return data;
      });
  };
};

/**
 * Make sure a promise does not return until this much time has passed since
 * being created.
 *
 * @param {number} delay Number of ms to wait until.
 */
function delayUntil(delay) {
  var timeNow = Date.now();

  return function (arg) {
    var timeElapsed = Date.now() - timeNow;

    if (timeElapsed > delay) {
      return arg;
    }

    var defer = $.Deferred();

    setTimeout(function () {
      defer.resolve(arg);
    }, delay - timeElapsed);

    return defer;
  };
}
