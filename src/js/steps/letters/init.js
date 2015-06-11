'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();

module.exports = function ($events, icons) {
  return function (data) {
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('.letter:not(.special-char)');
    var $letterSpans = $('.letter-spans');

    $events.on('letterChange', function (e, page) {
      var currentPage = Math.floor((page - 1) / 2);
      if (currentPage < 0) {
        currentPage = 0;
      } else if (currentPage > $spans.length - 1) {
        currentPage = $spans.length - 1;
      }

      $spans
        .filter('.letter-active')
          .removeClass('letter-active')
          .end()
        .eq(currentPage)
          .addClass('letter-active');

      if (isMobile && icons) {
        var $currentLetter = $spans.eq(currentPage);
        var $currentChar = $currentLetter.find('.char');
        var halfScreenWidth = $(window).width() / 2;
        if ($currentChar.length !== 0) {
          var centerOffset = $currentChar.offset().left - halfScreenWidth;
          var currentScroll = $letterSpans.scrollLeft();
          $letterSpans.animate({ scrollLeft: (centerOffset + currentScroll) });
        };
      }
    });

    $letters.on('click', '.letter', function () {
      var $this = $(this);
      var charsBefore = $this.prevAll('.special-char').length;
      data.turnToPage($this.index() - charsBefore);
    });

    if (isMobile && icons) {
      var animationDelay = 1000;
      var animationSpeed = 800;
      setTimeout(function () {
        $letters.animate({ marginLeft: '100px' }, animationSpeed)
      }, animationDelay);
    }

    return data;
  };
};
