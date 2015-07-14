'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();

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
      var $pickerContainer = $('<div />')
        .addClass('picker-container')
        .appendTo($monkeyContainer);
    }

    var allCharacters = $.map(data.combinedLetters, function (el) {
        return el.selected || '';
      });


    var loadLetterPicker = function () {
      $(data.combinedLetters).each(function (i, letter) {

        var $toolTip = $('<div />');
        $toolTip.appendTo($pickerContainer)
          .addClass('character-picker pos-absolute');

        if(isMobile) {
          $toolTip.appendTo($pickerContainer)
        } else {
          $toolTip.appendTo($letterDiv)
          var toolTipMargin = parseInt($toolTip.outerWidth() / -2, 10);

          $toolTip.css({
            'margin-left': toolTipMargin
          });
        }

        if (icons && letter.thumbnail) {

          var $changeSpan = $('<span />')
            .addClass('change-character color-alert')
            .text('CHANGE');
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          var $letterDiv = $('.letter[data-letter="' + letter.letter + '"]' +
            '[data-character="' + letter.default_character + '"]');
          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          $changeSpan.appendTo($letterDiv);

         	var $letterDiv = $('.letter[data-letter="'+letter.letter+'"][data-character="'+letter.default_character+'"]');
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

          var $charContainer = $('<div />')
            .addClass('char-container');
          $charContainer.appendTo($toolTip);
          $toolTipArrow.clone().prependTo($toolTip);

          $(remainingLetterChars).each(function (ix, charObj) {
            // Include the character in the selection if not used earlier
            var $imgContainer = $('<div />')
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

            var $selectButton = $('<button />')
              .data('char', charObj)
              .data('page', i);

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
    	.then(function() {
    		return data;
    	});
  }
}
