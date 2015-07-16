'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();
var numOfCentralizedChars = require('../../helpers/getCentralizedCharCount')();

/**
 *
 * Generate HTML for the Character Picker
 *
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
        return el.selected || '';
      });

    var loadLetterPicker = function () {
      var currentDisplayPage = 0;
      $(data.combinedLetters).each(function (i, letter) {

        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        var $letterDiv = letter.type !== 'bridge' ?
                        $('.letter[data-letter="' + letter.letter + '"]' +
                        '[data-character="' + letter.default_character + '"]') :
                        $('.letter[data-letter=""][data-type="bridge"]');
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        var $toolTip = $('<div />');
        $toolTip
          .addClass('character-picker pos-absolute');

        if (isMobile) {
          $toolTip.appendTo($pickerContainer);
          var $closeButton = $('<button>')
              .attr('type', 'button')
              .addClass('button primary character-picker__close')
              .attr('data-js', 'close-mobile-char-picker')
              .text('Close');
          $closeButton.appendTo($toolTip);

          if (data.name.length <= numOfCentralizedChars) {
            $toolTip.addClass('character-picker--no-arrow');
          }
        } else {
          $toolTip.appendTo($letterDiv);
          var toolTipMargin = parseInt($toolTip.outerWidth() / -2, 10);

          $toolTip.css({
            marginLeft: toolTipMargin
          });
        }

        if (icons && letter.thumbnail) {

          var $changeSpan = $('<span />')
            .addClass('change-character color-alert')
            .text('CHANGE');

          $changeSpan.appendTo($letterDiv);

          var charPickTitle;

          var remainingLetterChars = $.grep(letter.characters, function (charObj) {
            return (charObj.character === allCharacters[i]) || allCharacters.indexOf(charObj.character) === -1;
          });



          if (remainingLetterChars.length < 2) {
            charPickTitle = 'Sorry. No more ‘' + letter.letter +
              '’ characters available.';
          } else {
            charPickTitle = 'Choose another story for ‘' + letter.letter + '’';
          }
          var $charPickTitle = $('<div />')
            .text(charPickTitle)
            .addClass('title');
          $charPickTitle.appendTo($toolTip);
          if (remainingLetterChars.length > 0) {
            var $charContainer = $('<div />')
              .addClass('char-container');
            $charContainer.appendTo($toolTip);
          }

          $toolTipArrow.clone().prependTo($toolTip);

          $(remainingLetterChars).each(function (ix, charObj) {
            // Include the character in the selection if not used earlier
            var $imgContainer = $('<button />')
              .attr('data-js', 'switch-character')
              .attr('data-character', charObj.character)
              .data('char', charObj)
              .data('page', currentDisplayPage)
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
                .text('In Use');
            } else {
              $selectButton
                .addClass('button primary')
                .text('Select');
            }
            $selectButton.appendTo($charName);
          });
        }
        if (!(letter.letter === '-' || letter.letter === ' ')) {
          currentDisplayPage++;
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
