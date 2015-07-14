'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();

/**
 *
 * Generate HTML for the Character Picker
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 * @param  {boolean} Boolean to decide whether to show icons (necessary?)
 * @return {[type]}
 */
module.exports = function (selector, lang, icons, monkeyContainer) {
  if (typeof lang === 'undefined' && typeof selector === 'object') {
    lang = selector;
    selector = true;
  }
  var defer = $.Deferred();

  return function (data) {

    var $toolTipArrow = $('<img />')
        .addClass('tooltip-arrow')
        .attr('src', 'https://s3-eu-west-1.amazonaws.com/lmn-cdn-assets/widget/tooltip-arrow-85x47.png');

    var $monkeyContainer = monkeyContainer;

    if (isMobile) {
      var $pickerBg = $('<div />')
        .addClass('picker-container__bg');
      $pickerBg.appendTo($monkeyContainer);

      var $pickerContainer = $('<div />')
        .addClass('picker-container')
        .appendTo($monkeyContainer);
    }

    var allCharacters = $.map(data.combinedLetters, function (el) {
        return el.selected;
      });

    var loadLetterPicker = function () {
      $(data.combinedLetters).each(function (i, letter) {

        if (icons && letter.thumbnail) {

          var $toolTip = $('<div />');
          var $changeSpan = $('<span />')
            .addClass('change-character color-alert')
            .text('CHANGE');
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          var $letterDiv = $('.letter[data-letter="' + letter.letter + '"]' +
            '[data-character="' + letter.default_character + '"]');
          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          $changeSpan.appendTo($letterDiv);

          var charPickTitle;

          var remainingLetterChars = $.grep(letter.characters, function (charObj) {
            return (charObj.character === allCharacters[i]) || allCharacters.indexOf(charObj.character) === -1;
          });

          if (remainingLetterChars < 2) {
            charPickTitle = 'Sorry. No more ‘' + letter.letter +
              '’ characters available.';
          } else {
            charPickTitle = 'Choose another story for ‘' + letter.letter + '’';
          }
          var $charPickTitle = $('<div />')
            .text(charPickTitle)
            .addClass('title');
          $charPickTitle.appendTo($toolTip);

          var $charContainer = $('<div />')
            .addClass('char-container');
          $charContainer.appendTo($toolTip);
          $toolTipArrow.clone().prependTo($toolTip);

          if (isMobile) {
            $toolTip.appendTo($pickerContainer)
              .addClass('character-picker pos-absolute');

            var $closeButton = $('<button>')
              .attr('type', 'button')
              .addClass('button primary character-picker__close')
              .attr('data-js', 'close-mobile-char-picker')
              .text('Close');
            $closeButton.appendTo($toolTip);
          } else {
            $toolTip.appendTo($letterDiv)
            .addClass('character-picker pos-absolute');
            var toolTipMargin = parseInt($toolTip.outerWidth() / -2, 10);

            $toolTip.css({
              'margin-left': toolTipMargin
            });
          }

          $(remainingLetterChars).each(function (ix, charObj) {
            // Include the character in the selection if not used earlier
            var $imgContainer = $('<button />')
              .attr('data-js', 'switch-character')
              .data('char', charObj)
              .data('page', i)
              .addClass('img-container');

            var $img = $('<img />')
              .attr('src', charObj.thumbnail)
              .addClass('character-image');
            var $charName = $('<div />')
              .addClass('character-name')
              .text(charObj.character);
            $imgContainer.appendTo($charContainer);
            $img.appendTo($imgContainer);
            $charName.appendTo($imgContainer);

            var $selectButton = $('<span />');

            if (letter.selected === charObj.character) {
              $imgContainer.addClass('selected-char');
              $selectButton
                .addClass('button')
                .attr('disabled', true)
                .text('selected');
            } else {
              $selectButton
                .addClass('button primary')
                .text('select');
            }
            $selectButton.appendTo($charName);
          });
        }
        defer.resolve();

      });
      return defer.promise();
    };

    return loadLetterPicker()
      .then(function () {
        return data;
      });
  };
};
