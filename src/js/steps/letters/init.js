'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();
var numOfCentralizedChars = require('../../helpers/getCentralizedCharCount')();

var animationDelay = 1600;
var animationSpeed = 800;

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
    var $allSpans = $letters.find('.letter');
    var $letterSpans = $('.letter-spans');
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
    var $activeLetter,
      $currentPicker;

    data.canSetUpMobileScrollListener = true;

    function setUpPicker($activePicker, $activeLetter) {
      if (isMobile) {
        if ($activePicker.length === 0) {
          return false;
        }
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

    function destroyPicker($activePicker, $activeLetter) {
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

      $allSpans.each(function () {
        calculatedWidth += $(this).outerWidth(true);
      });
      $letters.css({ width: calculatedWidth });
    }

    var openingMargin = ($monkey.width() / 2) -
                        ($('.letter').eq(0)[0].clientWidth) -
                        ($('.letter').eq(1)[0].clientWidth / 2);

    function nameAgitator() {
      var classes = {
        agitator: 'letter-spans--agitated'
      };
      data.lettersElement.one('mousedown touchstart pointerdown', function () {
        $letters.removeClass(classes.agitator);
      });

      function agitate() {
        $letters.addClass(classes.agitator);
      }
      agitate();

    }

    function getFirstChangedCharOffset() {

      if (data.shouldShowDuplicateModal) {
        var $changed = $('.letter.changed').eq(0);
        var val = $changed.position().left -
                  ($changed.outerWidth(true) / 2);
        return val;
      }
      return 0;
    }

    if (data.name.length > numOfCentralizedChars) {
      if (isMobile && options.icons && options.animateName && calculatedWidth > 0) {
        if (data.shouldShowDuplicateModal) {
          data.canSetUpMobileScrollListener = false;
          $letters
            .css({
              marginLeft: openingMargin,
              paddingRight: openingMargin,
              width: calculatedWidth + 10 + openingMargin
            });
          $letterSpans
          .delay(animationDelay)
          .animate({
            scrollLeft: getFirstChangedCharOffset()
          }, animationSpeed, function () {
            nameAgitator();
            data.canSetUpMobileScrollListener = true;
          });
        } else {
          $letters
            .css({
              paddingRight: openingMargin,
              width: calculatedWidth + 10 + openingMargin
            })
            .delay(animationDelay)
            .animate({
              marginLeft: openingMargin
            }, animationSpeed, nameAgitator);
        }

      } else if (isMobile && !options.animateName) {
        $letters.css({
          marginLeft: openingMargin,
          paddingRight: openingMargin,
          width: calculatedWidth + 10 + openingMargin
        });
      }
    } else if (isMobile) {
      $letters.css({
        margin: '0 auto'
      });
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
            .animate({ scrollLeft: centerOffset }, animationSpeed / 4);
        }
      }
    });

    $letters.on('click', '.letter:not(.nonclickable)', function (evt) {
      if ($monkey.hasClass('js--active-overlay')) {
        return false;
      }
      $('html').one('click', function () {
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
        $letterParent = $(this).closest('.letter');
        letterParentIndex = $letterParent.index();
        $letterCharPicker = $monkey
                              .find('.character-picker')
                              .eq(letterParentIndex - 1);
      } else {
        $letterCharPicker = $(this).parent().find('.character-picker');
      }
      setUpPicker($letterCharPicker, $letterParent);
    });

    data.getChangedCharacter = function (button, evt) {
      var $buttonEl = $(button);
      var character = $buttonEl.data('char');
      var page = $buttonEl.data('page');
      var $currentLetter = $activeLetter || $buttonEl.closest('.letter');
      switchActiveButtonState($currentLetter, character);
      data.changeCharacter(page, character, $currentLetter);

      return evt.stopPropagation();
    };

    function switchActiveButtonState($currentLetter, currentCharacter) {
      var $pickerEl = isMobile ?
                      $monkey
                        .find('.character-picker')
                        .eq($currentLetter.index() - 1) :
                      $currentLetter.find('.character-picker');

      var $buttonEl = $pickerEl.find('[data-js="switch-character"]' +
                                      '[data-character="' + currentCharacter.character + '"]');
      var selectedChar = $pickerEl.find('.selected-char');
      var $prevButton = selectedChar.find('.button');

      selectedChar.removeClass('selected-char');
      $prevButton
        .removeAttr('disabled')
        .text('Select')
        .addClass('primary');

      $buttonEl.find('.button')
        .attr('disabled', true)
        .removeClass('primary')
        .text('In Use');
      $buttonEl.addClass('selected-char');
      destroyPicker($pickerEl);
    }

    data.changeCharacter = function (page, character, $currentLetter) {
      if (options.icons) {
        changeLetterThumbnail($currentLetter, character);
      }
      if (options.showCharPicker) {
        switchActiveButtonState($currentLetter, character);
      }
      data.swapPage(page, character);
      $currentLetter
        .data('char', character.character);
      $spans = $spans ||
                data
                  .lettersElement
                  .find('#letters')
                  .find('.letter:not(.special-char)');
      var charactersArray = $.map($spans, function (el) {
        return $(el).attr('data-character');
      });
      $events.trigger('charactersChanged', { characters: charactersArray });
    };

    function changeLetterThumbnail($letter, character) {
      var $card = $letter.find('.character-card');
      var $currentThumb = $card.find('img');
      var currentUrl = $currentThumb.attr('src');
      if (currentUrl !== character.thumbnail) {
        var $newThumb = $currentThumb.clone();
        $currentThumb.addClass('character-card__image--old');
        $newThumb
          .appendTo($card)
          .addClass('character-card__image--new')
          .attr('src', character.thumbnail);
        setTimeout(function () {
          $currentThumb.remove();
          $newThumb.removeClass('character-card__image--new');
        }, 400);
      }
      return this;
    }

    if (options.icons) {
      $charButtons.on('click', function (evt) {
        data.getChangedCharacter(this, evt);
      });
    }

    return data;
  };
};
