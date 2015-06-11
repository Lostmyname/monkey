'use strict';

var $ = require('jquery');

/**
 * Generate HTML for letters.
 *
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 */
module.exports = function (selector, lang, icons) {
  if (typeof lang === 'undefined' && typeof selector === 'object') {
    lang = selector;
    selector = true;
  }

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

    var $letterSpanContainer = $('<div />').appendTo($lettersContainer)
      .addClass('letter-spans');

    var $letters = $('<div />').appendTo($letterSpanContainer)
      .addClass('strong')
      .attr('id', 'letters');

    var letters = data.name.split('');
    var dataLetters = $(data.letters).filter(function (i, letter) {
      return letter.part === 1;
    });

    // If name short, add blank letter for extra story
    if (letters.length < 5) {
      letters.splice(-1, 0, '');
    }
    var combinedLetters = combineLetters(letters, dataLetters);

    $(combinedLetters).each(function (i, letter) {
      var $letterDiv = $('<div />');
      $letterDiv.appendTo($letters)
        .addClass('letter')
        .after(' ');

      var $letterSpan = $('<div />')
        .toggleClass('char', letter.letter !== '')
        .text(letter.letter || '');
      $letterSpan.appendTo($letterDiv);

      if (icons && letter.thumbnail) {
        var $characterCard = $('<div />');
        $characterCard.appendTo($letterDiv)
          .addClass('character-card');

        var $charCardImg = $('<img />')
          .attr('src', letter.thumbnail);
        $charCardImg.appendTo($characterCard);
      }
    });

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
      $book = data.html.parents('[data-key="lmn-book"]');
    }

    data.lettersElement = $lettersContainer.prependTo($book);

    if (icons) {
      $lettersContainer.parents('#monkey').addClass('monkey-icons');
    };

    return data;
  };
};

var combineLetters = function (splitLetters, dataLetters) {
  var offset = 0
  return $.map(splitLetters, function (val, i) {
    var idx = i - offset;
    if (val === '-' || val === '') {
      offset++;
      return { letter: val };
    } else {
      dataLetters[idx].letter = val;
      return dataLetters[idx];
    }
  });
}
