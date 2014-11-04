'use strict';

module.exports = function (monkey, monkeyData) {
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

  if (monkeyData.monkeyType === 'mobile') {
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
  }

  return defer.promise();

  // @todo: Make this work
  function makeRequest() {
//    $.get('/bla')
//      .then(function (data) {
//        if (data.displayable) {
          resolved = true;
          defer.resolve(monkey, monkeyData);
//        }
//      });
  }
};
