'use strict';

module.exports = function ($events) {
  return function (data) {
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('span');

    $events.on('letterChange', function (e, page) {
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
      data.turnToPage($(this).index());
    });

    return data;
  };
};
