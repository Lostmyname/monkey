'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();
var getCentralizedCharCount = require('../../helpers/getCentralizedCharCount');

var animationDelay = 1600;
var animationSpeed = 800;

/**
 * The big one. Initializes the letters, and adds event listeners, styles,
 * everything basically to make the letter selection work, esp. the character
 * picker. @todo Break this up into smaller partials?
 * @param  {object} $events          object attached to Monkey
 * @param  {object} options          options that Monkey was init. with
 * @param  {DOMElement} $monkeyContainer The container
 * @return {data}                  The data object passed through Promise chain
 */
module.exports = function ($events, options, $monkeyContainer) {
  return function (data) {
    var classes = {
      charPickerActive: 'character-picker--active',
      charPickerBgActive: 'picker-container__bg--active'
    };
    var $monkey = data.monkeyContainer;
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('.letter:not(.special-char)');
    var $allSpans = $letters.find('.letter');
    var $letterSpans = $('.letter-spans');
    // We have different pickers and character buttons for mobile/desktop.
    var $pickers = isMobile ? data.monkeyContainer
                                .find('.picker-container')
                                .find('.character-picker')
                            : $letters.find('.character-picker');
    var $charButtons = isMobile ? data.monkeyContainer
                                    .find('.picker-container')
                                    .find('[data-js="switch-character"]')
                                : $pickers.find('[data-js="switch-character"]');
    var $pickerBg = isMobile ? data.monkeyContainer.find('.picker-container__bg') : false;
    var $changeButtons = $letters.find('.change-character');
    var currentPageIndex = 0;
    var numOfCentralizedChars = getCentralizedCharCount();
    var $activeLetter,
      $currentPicker;
    // Store the current section so we can update the state of the buttons
    var currentCharacterSelection = [];
    // We want to use the browser :active state rather than tap color states
    // for our buttons. This enables that.
    if (isMobile && document.addEventListener) {
      document.addEventListener('touchstart', function () {}, false);
    }

    // See note in js/steps/letters/generateCharPicker.js as to why we update
    // this variable.
    $(window).on('resize orientationchange', function () {
      numOfCentralizedChars = getCentralizedCharCount();
    });

    // We don't want the agitator running when the overlay is active, so this is
    // a flag variable that gets changed when the overlay is visible, and
    // prevents the agitation from occurring.
    data.canSetUpMobileScrollListener = true;

    /**
     * Shows the current letter's picker
     * @param {DOMElement} $activePicker The picker we're going to activate
     * @param {DOMElement} $activeLetter The current letter
     */
    function setUpPicker($activePicker, $activeLetter) {
      if (isMobile) {
        if ($activePicker.length === 0) {
          return false;
        }
        $pickerBg.addClass(classes.charPickerBgActive);
        var bounding = $activeLetter.offset();
        // Because the active letter needs to appear above the overlay that gets
        // set, we need to clone the active letter and put it above the overlay.
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
        // On resize/orientationchange we need to re-set the cloned active
        // letter's position to match the active letter underneath.
        $(window).on('orientationchange resize', function () {
          var newBounding = $activeLetter.offset();
          $('.letter--cloned').css({
            left: newBounding.left,
            top: newBounding.top
          });
          $('.picker-container__bg').css({
            zIndex: 3
          });
        });
        // If we're viewing in landscape, then scroll to the active letter when
        // you tap as it's easily missed if you're at the top of your page.
        if (window.innerWidth > window.innerHeight) {
          $('html, body').animate({
            scrollTop: bounding.top
          }, 500);
        }
        $pickerBg.on('click', function () {
          destroyPicker($activePicker);
        });
      }
      $activePicker
        .addClass(classes.charPickerActive);
    }

    /**
     * Removes the active picker from display. Destroy is maybe too harsh a word
     * for what this does. Remove may be better suited, as it still exists after
     * the function has ran..
     * @param  {DOMElement} $activePicker The active picker
     * @param  {DOMElement} $activeLetter The active letter (rarely set as a param)
     * @return {null}
     */
    function destroyPicker($activePicker, $activeLetter) {
      if (isMobile) {
        $activeLetter = typeof $activeLetter !== 'undefined' ?
                          $activeLetter :
                          $('.letter--cloned');
        $activeLetter.remove();
        $pickerBg
          .removeClass(classes.charPickerBgActive)
          .removeAttr('style');
        $letterSpans.removeAttr('style');
      }
      $activePicker
        .removeClass(classes.charPickerActive);
    }

    // We need to calculate the width of all the letter spans to explicitly set
    // the width of the parent so we can scroll..
    var calculatedWidth = 0;
    if (options.icons) {

      $allSpans.each(function () {
        calculatedWidth += $(this).outerWidth(true);
      });
      $letters.css({ width: calculatedWidth });
    }

    /**
     * AGITATE. Animates the name with a little bounce motion to indicate that
     * the user can interact and scroll with it.
     * @return {null}
     */
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

    /**
     * Retuns the offset from the parent that the first changed character is.
     * This is used when the duplicate modal is displayed, and we want to center
     * the name to the first changed character, because it may be that with a
     * long name, it's not shown on screen which could be confusing for a user.
     * @return {null}
     */
    function getFirstChangedCharOffset() {

      if (data.shouldShowDuplicateModal) {
        var $changed = $('.letter.changed').eq(0);
        var val = $changed.position().left -
                  ($changed.outerWidth(true) / 2);
        return val;
      }
      return 0;
    }

    /**
     * Find the optical center point for the scrolled letters
     * @return {float} The margin that needs to be applied.
     */
    function getOpeningMargin() {
      // Find the optical centre point by calculation the actual center
      // point within $monkey, then taking away the front cover dot width
      // as we don't want to center that initially, and half of the width
      // of the first letter div.
      return ($monkey.width() / 2) -
             ($monkey.find('.letter').eq(0)[0].clientWidth) -
             ($monkey.find('.letter').eq(1)[0].clientWidth / 2);
    }

    /**
     * Sets up the name on a mobile device. This function checks to see whether
     * the name should be centered, or scrolled. If it's centered, some simple
     * CSS is applied to center the element. If it needs to scroll, we do some
     * calculations to get how much margin/padding we need to add to the element
     * in order to have the first letter centered, as we center each letter as
     * you select it on a mobile device. We then animate the name in, to show
     * that there is more content if you scroll.
     * @return {null}
     */
    function initializeName() {
      if (data.name.length > numOfCentralizedChars) {
        if (isMobile && options.icons && options.animateName && calculatedWidth > 0) {
          var openingMargin = getOpeningMargin();
          // If the duplicate modal is showing, animate to the first changed
          // character. We do this by changing the scrollLeft property of the
          // $letterSpans element so that the changed character is centred.
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
        // If we don't want to animate the name in, we just explicitly set the
        // margin/padding/width that enables the first element to be centred.
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
    }

    initializeName();

    // We need to change a few things when the orientation changes so that the
    // characters remain centred, or that the current character is in the centre
    // of the device window.
    $(window).on('orientationchange', function () {
      if (data.name.length > numOfCentralizedChars) {
        var openingMargin = getOpeningMargin();
        $letters.css({
          marginLeft: openingMargin,
          paddingRight: openingMargin,
          width: calculatedWidth + 10 + openingMargin
        });
      } else {
        $letters.css({
          margin: '0 auto',
          paddingRight: 0,
          width: calculatedWidth + 10
        });
      }
    });

    // Events

    // When a letter is changed. Note this is NOT when a character is changed,
    // but when a user clicks from J, to O, for example. This is a custom event
    // and not one which is automatically fired from clicking the letter. The
    // event gets fired in js/monkeys/[desktop|mobile].js init() fn.
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

      // If we're on a mobile device, scroll the letters across so that the new
      // current letter is centred in the device.
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

    // When clicking on a letter, we want to set up the picker. This is where
    // that happens.
    $letters.on('click', '.letter:not(.nonclickable)', function (evt) {
      // If an overlay is currently being displayed, we don't want the user to
      // be able to interact with the letters.
      if ($monkey.hasClass('js--active-overlay')) {
        return false;
      }
      // Add a destroy listener so that anywhere the user clicks the picker will
      // hide.
      $('html').one('click', function () {
        destroyPicker($pickers);
      });
      var $this = $(this);
      var charsBefore = $this.prevAll('.special-char').length;
      // Also hide all previous pickers that may be active.
      destroyPicker($('.' + classes.charPickerActive));

      data.turnToPage($this.index() - charsBefore);
      $activeLetter = $('#letters .letter-active');

      // Find the appropriate picker using indexes, and show that one.
      if (currentPageIndex === $this.index()) {
        $currentPicker = $($pickers[$this.index() - charsBefore - 1]);
        setUpPicker($currentPicker, $this);
      }

      currentPageIndex = $this.index();
      evt.stopPropagation();
    });

    /**
     * Finds the character stored in the data of a particular button in the
     * character picker, and then runs a function to actually make the switch.
     * This is only used when clicking on a character within the picker.
     * @param  {DOMelement} button The button that was pressed
     * @param  {object} evt        The event object
     * @return {function}          Prevents anything bubbling up.
     */
    data.getChangedCharacter = function (button, evt) {
      var $buttonEl = $(button);
      var character = $buttonEl.data('char');
      var page = $buttonEl.data('page');
      var $currentLetter = $activeLetter || $buttonEl.closest('.letter');
      switchActiveButtonState($currentLetter, character);
      data.changeCharacter(page, character, $currentLetter, true);

      return evt.stopPropagation();
    };

    /**
     * Visually changes the buttons based upon the selected button. This will
     * change all buttons in a set back to the default state of 'Select' whilst
     * the buttons corresponding to the currentCharacterSelection object will be
     * changed to the selected 'In Use' button style.
     * @param  {DOMElement} $currentLetter  The current letter
     * @param  {object} currentCharacter The current character object
     * @return {null}
     */
    function switchActiveButtonState($currentLetter, currentCharacter) {
      var $pickerEl = $monkey.find('.character-picker');
      var $disableButtons = [];

      currentCharacterSelection.forEach(function(char) {
        var $buttonEl = $pickerEl.find('[data-js="switch-character"]' +
                                        '[data-character="' + char.character + '"]');
        $disableButtons.push($buttonEl);

      });

      $pickerEl.find('[data-js="switch-character"] .button')
        .removeAttr('disabled')
        .text('Select')
        .addClass('primary');

      $disableButtons.forEach(function($button) {
        $button.find('.button')
          .attr('disabled', true)
          .removeClass('primary')
          .text('In Use');
      });

      destroyPicker($pickerEl);
    }

    /**
     * If the character selection changes from the default, this creates an
     * array of the new characters, and sends that data to a custom event which
     * is used by Eagle to generate a hidden form element containing the new
     * characters so the new selection can be brought through to the database.
     * @return {null}
     */
    data.updateCharSelection = function () {
      var $spans = $spans ||
                data
                  .lettersElement
                  .find('#letters')
                  .find('.letter:not(.special-char)');
      var charactersArray = $.map($spans, function (el) {
        var $letter = $(el);
        if ($letter.attr('data-letter')) {
          var character = $letter.attr('data-selected-character');
          var res = { letter: $letter.attr('data-letter') };
          if ($letter.attr('data-helper-character')) {
            res.helper = character;
          } else {
            res.character = character;
          }
          return res;
        }
      });
      currentCharacterSelection = charactersArray;
      $events.trigger('charactersChanged', { characters: charactersArray });
    };

    /**
     * Wrapper function for other functions which all contribute to changing the
     * character within a letter. It changes the thumbnail, changes the button
     * states, swaps the page in Heidelberg, updates the selected character data
     * attribute of the current letter, updates the charaction selection to be
     * sent to eagle, and sets a data value on the container to let other Monkey
     * components know that we have changed characters.
     * @param  {int} page             The page to go to
     * @param  {object} character     The character object
     * @param  {DOMElement} $currentLetter The current letter
     * @param  {boolean} updateChars  Whether to update the character selection
     * @return {null}
     */
    data.changeCharacter = function (page, character, $currentLetter, updateChars) {
      if (options.icons) {
        changeLetterThumbnail($currentLetter, character);
      }
      data.swapPage(page, character);
      $currentLetter
        .attr('data-selected-character', character.character);
      if (updateChars) {
        data.updateCharSelection();
      }
      if (options.showCharPicker) {
        switchActiveButtonState($currentLetter, character);
      }
      $monkeyContainer.data('changedChars', true);
    };

    /**
     * Changes the thumbnail of the current character within a letter. We do a
     * nice little animation to switch the elements out, hence why this is a
     * little more complicated than just switching out a src of an image.
     * @param  {DOMElement} $letter   The letter you want to switch thumbnail of
     * @param  {object} character The character object you want to switch
     * @return {this}
     */
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
