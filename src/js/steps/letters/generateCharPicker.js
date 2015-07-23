'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();
var getCentralizedCharCount = require('../../helpers/getCentralizedCharCount');
var lang = require('lang');

/**
 *
 * Generate HTML for the Character Picker
 *
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 * @param  {boolean} Boolean to decide whether to show icons (necessary?)
 * @return {[type]}
 */
module.exports = function (options, monkeyContainer) {
  var defer = $.Deferred();

  return function (data) {

    var numOfCentralizedChars = getCentralizedCharCount();

    $(window).on('resize orientationchange', function () {
      numOfCentralizedChars = getCentralizedCharCount();
    });

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
                        $monkeyContainer.find('.letter[data-letter="' + letter.letter + '"]' +
                        '[data-character="' + letter.default_character + '"]') :
                        $monkeyContainer.find('.letter[data-letter=""][data-type="bridge"]');
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
              .text(lang('monkey.char_picker.buttons.close'));
          $closeButton.appendTo($toolTip);

          if (data.name.length <= numOfCentralizedChars) {
            $toolTip.addClass('character-picker--no-arrow');
          }
          $(window).on('orientationchange resize', function () {
            if (data.name.length <= numOfCentralizedChars) {
              $toolTip.addClass('character-picker--no-arrow');
            } else {
              $toolTip.removeClass('character-picker--no-arrow');
            }
          });
        } else {
          $toolTip.appendTo($letterDiv);
          var toolTipMargin = parseInt($toolTip.outerWidth() / -2, 10);

          $toolTip.css({
            marginLeft: toolTipMargin
          });
        }

        if (options.icons && letter.thumbnail) {

          var $changeSpan = $('<span />')
            .addClass('change-character color-alert')
            .text(lang('monkey.char_picker.change'));

          $changeSpan.appendTo($letterDiv);

          var charPickTitle;

          var remainingLetterChars = $.grep(letter.characters, function (charObj) {
            return (charObj.character === allCharacters[i]) || allCharacters.indexOf(charObj.character) === -1;
          });

          if (remainingLetterChars.length < 2) {
            charPickTitle = lang('monkey.char_picker.title.not_remaining.part_1') +
                            ' ' + letter.letter + ' ' +
                            lang('monkey.char_picker.title.not_remaining.part_2');
          } else {
            charPickTitle = lang('monkey.char_picker.title.remaining') +
                            ' ‘' + letter.letter + '’';
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
                .text(lang('monkey.char_picker.buttons.in_use'));
            } else {
              $selectButton
                .addClass('button primary')
                .text(lang('monkey.char_picker.buttons.select'));
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
