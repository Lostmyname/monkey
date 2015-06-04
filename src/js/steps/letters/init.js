'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile');

module.exports = function ($events) {
  return function (data) {
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('.letter:not(.special-char)');

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
    });

    $letters.on('click', '.letter', function () {
      var $this = $(this);
      var charsBefore = $this.prevAll('.special-char').length;
      data.turnToPage($this.index() - charsBefore);
    });

    var $lettersWrapper = $('#letters');
    var animationDelay = 1000;
    var animationSpeed = 800;

    if (isMobile()) {
      setTimeout(function () {
        $lettersWrapper.animate({marginLeft:"100px"},animationSpeed);
      }, animationDelay);
    }

    return data;
  };
};
