'use strict';

var $ = require('jquery');
var isMobile = require('../../helpers/isMobile')();

/**
 * Generate HTML for letters.
 *
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 */
module.exports = function (selector, lang, icons, showCharPicker) {
  if (typeof lang === 'undefined' && typeof selector === 'object') {
    lang = selector;
    selector = true;
  }
  var defer = $.Deferred();

  return function (data) {
    var $lettersContainer = $('<div />');

    $lettersContainer.attr({
      id: 'letters-container',
      'class': 'aligned-center row leaded md-mar-b', // @todo: remove leaded
      'data-key': 'monkey-letters'
    });

    $('<p />').appendTo($lettersContainer)
      .addClass('unleaded no-mar') // @todo: remove unleaded when eagle dead
      .text(lang.bookFor);

    var $pickerContainer = $('<div />')
      .addClass('picker-container');

    var $letterSpanContainer = $('<div />')
      .appendTo($lettersContainer)
      .addClass('letter-spans');

    var $letters = $('<div />').appendTo($letterSpanContainer)
      .addClass('strong')
      .attr('id', 'letters');

    var letters = data.name.split('');

    // Get the total letters, by finding just the first part of each letter
    var dataLetters = $(data.letters).filter(function (i, letter) {
      return letter.part === 1;
    });

    var $divider = $('<hr />');
    // If name short, add blank letter for extra story
    if (letters.length < 5) {
      letters.splice(-1, 0, '');
    }
    var combinedLetters = data.combinedLetters = combineLetters(letters, dataLetters);

    var loadLetterCards = function () {
      var cardsToLoad = combineLetters.length;
      $(combinedLetters).each(function (i, letter) {
        var $letterDiv = $('<div />');
        $letterDiv.appendTo($letters)
          .addClass('letter')
          .attr('data-letter', letter.letter)
          .attr('data-character', letter.selected) // Make this lowercase?
          .after(' ');
        if (letter.changed) {
          $letterDiv.addClass('changed')
        };

        var $letterSpan = $('<div />')
          .toggleClass('char', letter.letter !== '')
          .text(letter.letter || '');
        $letterSpan.appendTo($letterDiv);

        if (icons && letter.thumbnail) {
          var $characterCard = $('<div />');
          $characterCard.appendTo($letterDiv)
            .addClass('character-card');

          var $icon = $('<img />')
            .attr('src', letter.thumbnail);
          $icon.appendTo($characterCard);

          $icon.on('load', function () {
            if (--cardsToLoad === 0) {
              console.log("resolving");
            }
          });
          defer.resolve();
        }
      });
      return defer.promise();
    };

    return loadLetterCards()
      .then(function() {
        $('<div />').html('&bull;')
          .prependTo($letters)
          .addClass('letter')
          .after(' ')
          .clone().appendTo($letters);

        var $book = false;
        if (typeof selector !== 'boolean') {
          $book = $(selector);
        }

        if (!$book || !$book.length) {
          $book = data.monkeyContainer;
        }

        $book.empty();
        $pickerContainer.prependTo($book.parent());
        data.lettersElement = $lettersContainer.appendTo($book);

        if (icons) {
          $lettersContainer.parents('#monkey').addClass('monkey-icons');
        };
        return data
      })
  };
};

var combineLetters = function (splitLetters, dataLetters) {
  var offset = 0
  return $.map(splitLetters, function (val, i) {
    var idx = i;
    if (splitLetters.length > 5) {
      idx = i - offset;
    }
    if (val === '-') {
      offset++;
      return { letter: val };
    } else {
      dataLetters[idx].letter = val;
      return dataLetters[idx];
    }
  });
}
