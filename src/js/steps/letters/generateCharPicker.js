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
      // Update the number of characters the name needs to be before it centers
      // the name on mobile devices. This is due to the fact that some names
      // could be centered on landscape, but need to scroll off the page on
      // portrait.
      numOfCentralizedChars = getCentralizedCharCount();
    });

    var $toolTipArrow = $('<img />')
        .addClass('tooltip-arrow')
        .attr('src', 'https://s3-eu-west-1.amazonaws.com/lmn-cdn-assets/widget/tooltip-arrow-85x47.png');

    var $monkeyContainer = monkeyContainer;

    // The mobile character picker is located differently to the desktop picker.
    // This is due to the fact we've got scrolling on the letters which means
    // that if we put the character picker within the letter – as we do on
    // desktop – it'll get cut off due to the overflow propert on the letter
    // parent scrolling element.
    if (isMobile) {
      var $pickerBg = $('<div />')
        .addClass('picker-container__bg');
      $pickerBg.appendTo($monkeyContainer);

      var $pickerContainer = $('<div />')
        .addClass('picker-container')
        .appendTo($monkeyContainer);
    }
    // Returns an array like ["J", "O", "N", "A", "T", "H", "A", "N"]
    var allCharacters = $.map(data.combinedLetters, function (el) {
        return el.selected || '';
      });

    var loadLetterPicker = function () {
      var currentDisplayPage = 0;
      $(data.combinedLetters).each(function (i, letter) {

        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        // If the character is a bridge (Tornado, Rainbow, Hole, etc) then it
        // won't have a letter to search for, so we find the bridge letter.
        var $letterDiv = letter.type !== 'bridge' ?
                        $monkeyContainer.find('.letter[data-letter="' + letter.letter + '"]' +
                        '[data-character="' + letter.default_character + '"]') :
                        $monkeyContainer.find('.letter[data-letter=""][data-type="bridge"]');
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        // Store each letter which is currently being used
        var usedCharacters = data.combinedLetters.map(function (letter) {
          return letter.selected;
        });
        var $toolTip = $('<div />');
        $toolTip
          .addClass('character-picker pos-absolute');

        // If this is the mobile picker, attach it to the picker container div
        // we created earlier, and add a close button. We also change the picker
        // depending on whether the name is centered, or scrolled on mobile. If
        // the name is centered, we remove the tooltip arrow, and shift the
        // picker up a little to better connect it to the current letter. This
        // is done by adding the .character-picker--no-arrow class to the
        // picker. On orientation change, we also perform this check as the name
        // could center or scroll depending on the length and the screen width.
        if (isMobile && letter.letter !== '-' && letter.letter !== ' ') {
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
        // If we're on desktop, it's a little simpler. We just add a negative
        // left margin to center the picker within the letter div, and append
        // it to the corresponding letter.
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
          // We need to calculate which letters have characters which you can
          // select, and be clever about it. Here, we're creating an array
          // containing only characters from a letter that haven't already
          // been used, so that a user can't select 3 elephants in their story.
          var remainingLetterChars = $.grep(letter.characters, function (charObj) {
            return (charObj.character === allCharacters[i]) || allCharacters.indexOf(charObj.character) === -1;
          });

          // If we've only got 1 remaining character, we need to show a message
          // saying that there's no characters left to choose. Or say there are
          // characters remaining.
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

          // For each of the remaining characters (note, even if there are no
          // other characters to select, this will still render the currently
          // selected character.)

          // For each of the the letter characters check to see if its already
          // being used. We show all of the characters at all points so its clear
          // which ones are available.
          var disabledCharacters = 0;
          $(letter.characters).each(function (ix, charObj) {
            // Here, we're just building the items within the picker. Only thing
            // to note is the data values we're adding to the button, which are
            // used when actually changing the character.
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
            if (usedCharacters.indexOf(charObj.character) === -1) {
              $selectButton
                .addClass('button primary')
                .text(lang('monkey.char_picker.buttons.select'));
            } else {
              $imgContainer.addClass('selected-char');
              $selectButton
                .addClass('button')
                .attr('disabled', true)
                .text(lang('monkey.char_picker.buttons.in_use'));
              disabledCharacters++;
            }
            $selectButton.appendTo($charName);
          });

          // hide the change label if all characters are disabled
          // TOTO Refactor: we are rendering character pickers that might never
          // be seen
          if (disabledCharacters === letter.characters.length) {
            $changeSpan.hide();
          } else {
            $letterDiv.data('char-picker-active', true)
          }
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
