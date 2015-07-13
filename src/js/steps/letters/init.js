'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();

var animationDelay = 1500;
var animationSpeed = 500;

module.exports = function ($events, options) {
  return function (data) {
    var classes = {
      charPickerActive: 'character-picker--active'
    };
    var $monkey = data.base;
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('.letter:not(.special-char)');
    var $letterSpans = $('.letter-spans');
    var $picker = $monkey.prev();
    //var $pickers = $picker.find('.character-picker');
    var $pickers = isMobile ? $('.picker-container').find('.character-picker') : $letters.find('.character-picker');
    var $charButtons = isMobile ? $('.picker-container').find('button') : $pickers.find('button');
    var $changeButtons = $letters.find('.change-character');
    var currentPageIndex = 0;
    var $activeLetter;
    var $currentPicker;

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
          var centerOffset = $currentLetter.position().left - ($currentLetter.outerWidth(true) / 2);
          $letterSpans
            .animate({ scrollLeft: centerOffset }, animationSpeed);
        }
      }
    });

    $letters.on('click', '.letter', function (evt) {
      $('html').on('click',function() {
        $('.character-picker').removeClass(classes.charPickerActive);
      });

      var $this = $(this);
      var charsBefore = $this.prevAll('.special-char').length;
      $('.'+classes.charPickerActive).removeClass(classes.charPickerActive);
      data.turnToPage($this.index() - charsBefore);
      $activeLetter = $('#letters .letter-active');
      if (currentPageIndex === $this.index()) {
        $currentPicker = $($pickers[$this.index() - 1]);
        $currentPicker
          .addClass(classes.charPickerActive);
      }

      currentPageIndex = $this.index();
      evt.stopPropagation();
    });

    $changeButtons.on('click', function (evt) {
      if(isMobile) {
        var $letterParent = $(this).closest('.letter'),
          letterParentIndex = $letterParent.index(),
          $letterCharPicker = $monkey
                                .find('.character-picker')
                                .eq(letterParentIndex - 1);
          $letterCharPicker.addClass(classes.charPickerActive);
      } else {
        $(this).parent().find('.character-picker').addClass(classes.charPickerActive);
      }
    });

    if (options.icons) {
      var calculatedWidth = 0;
      $spans.each(function () {
        calculatedWidth  += $(this).outerWidth(true);
      });
      $letters.css({ width: calculatedWidth + 10 });

      $charButtons.on('click', function () {
        var $buttonEl = $(this);
        var character = $buttonEl.data('char');
        var page = $buttonEl.data('page');

        var characterCard = $activeLetter.find('.character-card img');
        characterCard
          .attr("src", character.thumbnail);

        var selectedChar = $currentPicker.find('.selected-char');
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
    var openingMargin = ($(window).width() / 2)
                     - ($('.letter').eq(0)[0].clientWidth) 
                     - ($('.letter').eq(1)[0].clientWidth / 2);
    if (isMobile && options.icons && options.animateName) {
      $letters
        .css({
          paddingRight: openingMargin,
          width: calculatedWidth + 10 + openingMargin
        })
        .delay(animationDelay)
        .animate({
          marginLeft: openingMargin
        }, animationSpeed);
    } else if (isMobile && !options.animateName) {
      $letters.css({
        marginLeft: openingMargin,
        paddingRight: openingMargin,
        width: calculatedWidth + 10 + openingMargin
      });
    }

    return data;
  };
};
