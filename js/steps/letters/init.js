'use strict';

module.exports = function () {
  var monkey = this.monkey;

  return function (data) {
    var handler = monkey.monkeys[data.monkeyType].letterHandler(data);

    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('span');

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

    $letters.on('click', 'span', function () {
      handler.turnToPage($(this).index());
    });

    return data;
  };
};
