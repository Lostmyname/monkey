'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();

var animationDelay = 1500;
var animationSpeed = 500;

module.exports = function ($events, options) {
  return function (data) {
    var classes = {
      charPickerActive: 'character-picker--active',
      charPickerBgActive: 'picker-container__bg--active'
    };
    // @todo: tidy this up
    var $monkey = data.base;
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('.letter:not(.special-char)');
    var $letterSpans = $('.letter-spans');
    // var $pickers = $picker.find('.character-picker');
    var $pickers = isMobile ? data.base
                                .find('.picker-container')
                                .find('.character-picker')
                            : $letters.find('.character-picker');
    var $charButtons = isMobile ? data.base
                                    .find('.picker-container')
                                    .find('[data-js="switch-character"]')
                                : $pickers.find('[data-js="switch-character"]');
    var $pickerBg = isMobile ? data.base.find('.picker-container__bg') : false;
    var $changeButtons = $letters.find('.change-character');
    var currentPageIndex = 0;
    var $activeLetter;
    var $currentPicker;

    function setUpPicker ($activePicker, $activeLetter) {
      if (isMobile) {
          $pickerBg.addClass(classes.charPickerBgActive);
          var bounding = $activeLetter.offset();
          $activeLetter
            .clone()
            .addClass('letter--cloned')
            .insertAfter($monkey)
            .css({
              fontSize: '1.2em',
              position: 'absolute',
              left: bounding.left,
              lineHeight: 1.2,
              top: bounding.top,
              zIndex: 3
            });
          $letterSpans.css({
            overflow: 'hidden'
          });
          $pickerBg.on('click', function () {
            destroyPicker($activePicker);
          });
      }
      $activePicker
        .addClass(classes.charPickerActive);
    }

    function destroyPicker ($activePicker, $activeLetter) {
      if (isMobile) {
        $activeLetter = typeof $activeLetter !== 'undefined' ?
                          $activeLetter :
                          $('.letter--cloned');
        $activeLetter.remove();
        $pickerBg
          .removeClass(classes.charPickerBgActive);
        $letterSpans.removeAttr('style');
      }
      $activePicker
        .removeClass(classes.charPickerActive);
    }

    var calculatedWidth = 0;
    if (options.icons) {

      $spans.each(function () {
        calculatedWidth  += $(this).outerWidth(true);
      });
      $letters.css({ width: calculatedWidth });
    }

    var openingMargin = ($(window).width() / 2) -
                        ($('.letter').eq(0)[0].clientWidth) -
                        ($('.letter').eq(1)[0].clientWidth / 2);

    if (data.name.length > 5) {
      if (isMobile && options.icons && options.animateName && calculatedWidth > 0) {
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
    } else {
      if (isMobile) {
        $letters.css({
          margin: '0 auto'
        });
      }
    }

    // Events

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
        if ($currentChar.length !== 0) {
          var centerOffset = $currentLetter.position().left -
                            ($currentLetter.outerWidth(true) / 2);
          $letterSpans
            .animate({ scrollLeft: centerOffset }, animationSpeed);
        }
      }
    });

    $letters.on('click', '.letter', function (evt) {
      $('html').on('click', function () {
        destroyPicker($pickers);
      });
      var $this = $(this);
      var charsBefore = $this.prevAll('.special-char').length;

      destroyPicker($('.' + classes.charPickerActive));

      data.turnToPage($this.index() - charsBefore);
      $activeLetter = $('#letters .letter-active');

      if (currentPageIndex === $this.index()) {
        $currentPicker = $($pickers[$this.index() - 1]);
        setUpPicker($currentPicker, $this);
      }

      currentPageIndex = $this.index();
      evt.stopPropagation();
    });

    $changeButtons.on('click', function () {
      var $letterParent,
        letterParentIndex,
        $letterCharPicker;
      if (isMobile) {
        $letterParent = $(this).closest('.letter'),
        letterParentIndex = $letterParent.index(),
        $letterCharPicker = $monkey
                              .find('.character-picker')
                              .eq(letterParentIndex - 1);
      } else {
        $letterCharPicker = $(this).parent().find('.character-picker');
      }
      setUpPicker($letterCharPicker, $letterParent);
    });

    if (options.icons) {
      $charButtons.on('click', function () {
        var $buttonEl = $(this);
        var character = $buttonEl.data('char');
        var page = $buttonEl.data('page');

        var characterCard = $activeLetter.find('.character-card img');
        characterCard
          .attr('src', character.thumbnail);

        var selectedChar = $currentPicker.find('.selected-char');
        selectedChar.removeClass('selected-char');
        var $prevButton = selectedChar.find('.button');
        $prevButton
          .removeAttr('disabled')
          .text('Select')
          .addClass('primary');

        $buttonEl.find('.button')
          .attr('disabled', true)
          .removeClass('primary')
          .text('In Use');
        $buttonEl.addClass('selected-char');
        data.swapPage(page, character);
      });
    }

    return data;
  };
};
