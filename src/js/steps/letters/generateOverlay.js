'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();
var lang = require('lang');


/**
 * Generate HTML for letters.
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

      $events.trigger('overlayActive', $monkeyContainer);

      $monkeyContainer.addClass(classes.overlayActive);

      $overlay.appendTo($monkeyContainer.find('.js--add-overlay'))
        .addClass('overlay');

      $monkeyContainer
        .next()
        .hide();

      var $overlayInner = $('<div />')
        .addClass('overlay__inner lg-pad lg-pad-on-md sm-pad-on-sm');
      $overlayInner.appendTo($overlay);

      var $overlayContent = $('<div />')
        .addClass('row');
      $overlayContent.appendTo($overlayInner);

      var $titleBox = $('<h4 />')
        .text(lang('monkey.overlay.nounTypes.' + singularOrPlural + '.title'));
      $titleBox.appendTo($overlayContent);
      var comparisonName = options.book.comparisonBooks[0].name;

      var overlayText = lang('monkey.overlay.nounTypes.' + singularOrPlural + '.intro') + ' ' +
                        lang('monkey.overlay.copy.part_1') + ' ' +
                        comparisonName.toUpperCase() + ' & ' +
                        data.name.toUpperCase() +
                        lang('monkey.overlay.copy.part_2') + ' ' +
                        lang('monkey.overlay.nounTypes.' + singularOrPlural + '.letter') + ' ' +
                        lang('monkey.overlay.copy.part_3');

      var $messageBox = $('<div />')
        .text(overlayText)
        .addClass('overlay__copy col');
      $messageBox.appendTo($overlayContent);

      var $buttonContainer = $('<div />')
        .addClass('col overlay__buttons');

      var $yesButton = $('<button />')
        .text(lang('monkey.overlay.buttons.yes'))
        .addClass('button primary col md-mar-t-on-sm sm-mar md-mar-t-on-xs no-mar-on-xs');

      var $noButton = $('<button />')
        .text(lang('monkey.overlay.buttons.no'))
        .addClass('button col md-mar-t-on-sm sm-mar md-mar-t-on-xs no-mar-on-xs');

      $buttonContainer.appendTo($overlayContent);
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
        closeOverlay();
      });

      $noButton.on('click', function () {
        revertCharsToOriginal(closeOverlay);
      });

      function closeOverlay() {
        $events.trigger('overlayClosed', $monkeyContainer);
        $monkeyContainer
          .next()
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

      function revertCharsToOriginal(callback) {
        for (var i = 0; i < data.combinedLetters.length; i++) {
          var letter = data.combinedLetters[i];
          if (letter.changed === true) {
            var characters = letter.characters;
            for (var j = 0; j < characters.length; j++) {
              var character = characters[j];
              if (character.character === letter.default_character) {
                var $letter = $('.letter[data-letter="' + character.letter + '"]' +
                                '[data-character="' + character.character + '"]');
                data.changeCharacter(i, character, $letter);
              }
            }

          }
        }
        callback();
      }
      return defer.promise();
    }
    if (data.shouldShowDuplicateModal !== false) {
      loadOverlay()
        .then(function () {
          return data;
        });
    }
    return data;
  };
};
