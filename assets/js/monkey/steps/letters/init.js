'use strict';

module.exports = function () {
  return function (data) {
    var monkey = data.monkey;
    var handler = monkey.monkeys[data.monkeyType].letterHandler(this, data);

    var $spans = data.letters.find('#letters span');

    $(handler).on('letterChange', function (e, page) {
      var currentPage = Math.floor((page - 1) / 2);
      if (currentPage < 0) {
        currentPage = 0;
      } else if (currentPage > $spans.length - 1) {
        currentPage = $spans.length - 1;
      }

      $spans.filter('.letter-active').removeClass('letter-active').end()
        .eq(currentPage).addClass('letter-active');
    });

    return data;
  };
};
