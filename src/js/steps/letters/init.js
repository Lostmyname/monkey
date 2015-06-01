'use strict';

var $ = require('jquery');

module.exports = function ($events) {
  return function (data) {
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('.letter');

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

    $letters.on('click', '.letter', function () {
      data.turnToPage($(this).index());
    });

    var $letterSpan = $('.letter-spans');
    var animationDelay = 500;
    var animationSpeed = 1200;

    setTimeout(function () {
      $letterSpan.animate({ scrollLeft: '400px' }, animationSpeed, function () {
        $letterSpan.animate({ scrollLeft: '-400px' }, animationSpeed);
      });
    }, animationDelay);

    return data;
  };
};
