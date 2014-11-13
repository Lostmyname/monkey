'use strict';

module.exports = function (monkeyData, monkey) {
  var $monkey = monkeyData.html;
  var defer = $.Deferred();
  var resolved = false;

  setTimeout(function () {
    makeRequest();

    var interval = setInterval(function () {
      if (resolved) {
        clearInterval(interval);
        return;
      }

      makeRequest();
    }, 5000);
  }, 3000);

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

    if ($monkey.scrollLeft() + 1500 > $monkey.children('div').width()) {
      $monkey.off('scroll.monkeyPoll');
      makeRequest();
    }
  });

  return defer.promise();

  function makeRequest() {
    $.post(monkey.options.server, { widget: monkey.options.book })
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
