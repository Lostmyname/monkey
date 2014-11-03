'use strict';

module.exports = function () {
  return function (data) {
    var monkey = data.monkey;
    var handler = monkey.monkeys[data.monkeyType].letterHandler(this, data);

    var $spans = data.letters.find('#letters span');

    $(handler).on('letterChange', function (e, page) {
      $spans.filter('.letter-active').removeClass('letter-active').end()
        .eq(page).addClass('letter-active');
    });

    return data;
  };
};
