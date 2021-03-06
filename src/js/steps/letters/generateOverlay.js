'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();
var lang = require('lang');


/**
 * Generate HTML for the overlay. This contains the code for both the duplicate
 * letter overlay, and the language overlay.
 *
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 */
module.exports = function (options, $events) {
  var defer = $.Deferred();
  return function (data) {
    function loadOverlay() {
      var $overlay = $('<div />');
      var $monkeyContainer = data.monkeyContainer;
      var classes = {
        overlayActive: 'js--active-overlay'
      };

      var singularOrPlural = data.shouldShowDuplicateModal === 1 ?
                      'singular' :
                      'plural';

      // Trigger an event which we can use in Eagle to hide the book form.
      $events.trigger('overlayActive', $monkeyContainer);

      $monkeyContainer.addClass(classes.overlayActive);

      $overlay.prependTo($monkeyContainer.find('.monkey-wrapper'))
        .addClass('monkey-overlay');

      // We want to hide the 'Tap to Preview' label when the overlay is visible
      // so the user only focuses on the content within the overlay, and because
      // it's nonsensical to have a label to 'Tap to Preview' when you, at that
      // stage, can't.
      $monkeyContainer
        .next('.italic')
        .hide();

      var $overlayContent = $('<div />')
        .addClass('row');
      $overlayContent.appendTo($overlay);

      var overlayTitle, overlayText;
      var comparisonName = '';
      if (typeof options.book.comparisonBooks !== 'undefined') {
        comparisonName = options.book.comparisonBooks[0].name;
      }

      // Here's where we change the content of the overlay dependant on which
      // overlay is showing. If we need more overlays for whatever reason, we
      // should probably change how this is done as it's not entirely scalable.
      if (options.showLanguageOverlay === true && $monkeyContainer.data('changedChars')) {
        overlayTitle = lang('monkey.language.title');
        overlayText = lang('monkey.language.copy');
      } else if (comparisonName !== '') {
        overlayTitle = lang('monkey.overlay.nounTypes.' + singularOrPlural + '.title');
        overlayText = comparisonName.toUpperCase() + ' & ' +
                      data.name.toUpperCase() + ' ' +
          lang('monkey.overlay.nounTypes.' + singularOrPlural + '.intro');
      }

      var $titleBox = $('<h4 />')
        .text(overlayTitle);
      $titleBox.appendTo($overlayContent);


      var $messageBox = $('<div />')
        .text(overlayText)
        .addClass('overlay__copy col');
      $messageBox.appendTo($overlayContent);

      var $buttonContainer = $('<div />')
        .addClass('col overlay__buttons');

      var $yesButton = $('<button />')
        .text(lang('monkey.overlay.buttons.yes_please'))
        .addClass('button button--primary col md-mar-t-on-sm sm-mar md-mar-t-on-xs no-mar-on-xs')
        .addClass('spaced-left-small-on-tablet-up block-on-fablet-down widest-on-fablet-down')
        .addClass('spaced-bottom-small-on-fablet-down');

      var $noButton = $('<button />')
        .text(lang('monkey.overlay.buttons.no_thanks'))
        .addClass('button col md-mar-t-on-sm sm-mar md-mar-t-on-xs no-mar-on-xs')
        .addClass('spaced-right-small-on-tablet-up block-on-fablet-down widest-on-fablet-down')
        .addClass('spaced-bottom-small-on-fablet-down');

      var $okayButton = $('<button />')
        .text(lang('monkey.language.buttons.okay'))
        .addClass('button col md-mar-t-on-sm sm-mar md-mar-t-on-xs no-mar-on-xs');

      $buttonContainer.appendTo($overlayContent);
      // We want to show just an 'Okay' button for the language overlay, but
      // a Yes/No choice if it's the duplicate letters overlay.
      if (options.showLanguageOverlay === true) {
        $okayButton.appendTo($buttonContainer, function () {
          defer.resolve();
        });
        $okayButton.on('click', function () {
          closeOverlay(true);
        });
      } else {
        if (isMobile) {
          $yesButton.appendTo($buttonContainer);
          $noButton.appendTo($buttonContainer, function () {
            defer.resolve();
          });
        } else {
          $noButton.appendTo($buttonContainer);
          $yesButton.appendTo($buttonContainer, function () {
            defer.resolve();
          });
        }

        $yesButton.on('click', function () {
          data.editCharacters = true;
          $monkeyContainer.data('changedChars', true);
          closeOverlay(true);
        });

        $noButton.on('click', function () {
          revertCharsToOriginal(closeOverlay);
          $monkeyContainer.data('changedChars', false);
        });
      }

      /**
       * Closes the active overlay, triggers the close event, shows the labels,
       * scrolls the letters back to the starting point if we're viewing a
       * duplicate letter modal.
       * @param  {boolean} updateChars Whether we want to update the characters
       * @return {null}
       */
      function closeOverlay(updateChars) {
        $events.trigger('overlayClosed', $monkeyContainer);
        if (updateChars) {
          data.updateCharSelection();
        }
        $monkeyContainer
          .next('.italic')
          .removeAttr('style');
        $('.letter').removeClass('changed');
        $('.letter-spans').animate({
          scrollLeft: 0
        }, 800, function () {
          $events.trigger('letterChange', 0);
        });
        $monkeyContainer
          .removeClass(classes.overlayActive)
          .css({ minHeight: 0 });
        $overlay.fadeOut(250, function () {
          $(this).remove();
        });

      }

      /**
       * If we're displaying the duplicate display, and the user wants to not
       * use the new characters we've selected for them, this function resets
       * the character selection to the letter defaults.
       * @param  {Function} callback callback function (usually closeOverlay())
       * @return {null}
       */
      function revertCharsToOriginal(callback) {
        data.combinedLetters
          .map((letter, index) => Object.assign({}, letter, { index }))
          .filter(letter => letter.changed === true)
          .reduce(function (arr, letter) {
            var characters = letter.characters
              .map(character => Object.assign({}, character, { pageIndex: letter.index }))
              .filter(character => character.character === letter.default_character);

            return [...arr, ...characters];
          }, [])
          .forEach(function (character) {
            var $letter = $(`.letter[data-letter=${character.letter}][data-character=${character.character}]`);
            data.changeCharacter(character.pageIndex, character, $letter, false);
          });

        callback(false);
      }
      return defer.promise();
    }
    if (data.shouldShowDuplicateModal !== false || options.showLanguageOverlay === true) {
      loadOverlay()
        .then(function () {
          return data;
        });
    }
    return data;
  };
};
