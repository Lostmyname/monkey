'use strict';

var $ = require('jquery');

// @todo this needs documenting.

module.exports = function (monkeyData, options) {
  var $monkey = monkeyData.html.find('Heidelberg-Book');
  var defer = $.Deferred();
  var resolved = false;

  var consts = {
    INITIAL_DELAY: 3000,
    INTERVAL: 5000
  };

  setTimeout(function () {
    makeRequest();

    var interval = setInterval(function () {
      if (resolved) {
        clearInterval(interval);
        return;
      }

      makeRequest();
    }, consts.INTERVAL);
  }, consts.INITIAL_DELAY);

  var halfDone = false;

  $monkey.on('scroll.monkeyPoll', function () {
    if (resolved) {
      $monkey.off('scroll.monkeyPoll');
      return;
    }

    if (!halfDone && $monkey.scrollLeft() > $monkey.children('div').width() / 2) {
      halfDone = true;
      makeRequest();
    }

    var A_BIT = 1500; // pixels
    if ($monkey.scrollLeft() > $monkey.children('div').width() - A_BIT) {
      $monkey.off('scroll.monkeyPoll');
      makeRequest();
    }
  });

  return defer.promise();

  function makeRequest() {
    $.getJSON(options.server, { widget: options.book })
      .then(function (data) {
        $.each(data.book.letters, function (i, letter) {
          if (letter.type === 'spread' && letter.ready) {
            resolved = true;
            defer.resolve(monkeyData, letter.url);
          }
        });
      });
  }
};
