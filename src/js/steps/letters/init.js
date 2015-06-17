'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();

var animationDelay = 1500;
var animationSpeed = 800;

module.exports = function ($events, options) {
  return function (data) {
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('.letter:not(.special-char)');
    var $letterSpans = $('.letter-spans');
    var $charButtons = $letters.find('button');

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

      if (isMobile && options.icons) {
        var $currentLetter = $spans.eq(currentPage);
        var $currentChar = $currentLetter.find('.char');
        var halfScreenWidth = $(window).width() / 2;
        if ($currentChar.length !== 0) {
          var centerOffset = $currentChar.offset().left - halfScreenWidth;
          var currentScroll = $letterSpans.scrollLeft();

          $letterSpans
            .animate({ scrollLeft: (centerOffset + currentScroll) }, animationSpeed);
        }
      }
    });

    $letters.on('click', '.letter', function () {
      var $this = $(this);
      var charsBefore = $this.prevAll('.special-char').length;
      data.turnToPage($this.index() - charsBefore);
    });

    if (options.icons) {
      var calculatedWidth = 0;
      $spans.each(function () {
        calculatedWidth  += $(this).outerWidth(true);
      });
      $letters.css({ width: calculatedWidth });

      $charButtons.on('click', function () {
        var $buttonEl = $(this);
        var character = $buttonEl.data('char');
        var page = $buttonEl.data('page');

        var activeLetter = $('#letters .letter-active');
        var characterCard = activeLetter.find('.character-card img');
        characterCard
          .attr("src", character.thumbnail);

        var selectedChar = activeLetter.find('.selected-char');
        selectedChar.removeClass('selected-char');
        var $prevButton = selectedChar.find('button');
        $prevButton
          .attr('disabled', false)
          .text('select')
          .addClass('primary');

        $buttonEl
          .attr('disabled', true)
          .removeClass('primary')
          .text('selected');
        $buttonEl.parent().addClass('selected-char')
        data.swapPage(page, character);
      });
    };

    if (isMobile && options.icons && options.animateName) {
      $letters
        .delay(animationDelay)
        .animate({ marginLeft: 100 }, animationSpeed);
    } else if (isMobile && options.animateName) {
      $letters.css({ marginLeft: 100 });
    }

    return data;
  };
};
