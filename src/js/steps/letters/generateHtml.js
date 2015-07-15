'use strict';

var $ = require('jquery');

/**
 * Generate HTML for letters.
 *
 * @param {object} options Options object from monkey.
 */
module.exports = function (options) {
  return function (data) {
    var $lettersContainer = $('<div />');

    $lettersContainer.attr({
      id: 'letters-container',
      'class': 'aligned-center row leaded md-mar-b', // @todo: remove leaded
      'data-key': 'monkey-letters'
    });

    var $hiddenName = $('<span />', {
      'class': 'for-screen-reader'
    }).text(' ' + data.name.toLowerCase());

    $('<p />').appendTo($lettersContainer)
      .addClass('unleaded no-mar') // @todo: remove unleaded when eagle dead
      .text(options.lang.bookFor)
      .append($hiddenName);

    var $letterSpanContainer = $('<div />')
      .appendTo($lettersContainer)
      .addClass('letter-spans')
      .attr('aria-hidden', 'true');

    var $letters = $('<div />')
      .appendTo($letterSpanContainer)
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

      // Ensures spaces and hyphens are not clickable in double barrel names
      if (letter.letter === ' ' || letter.letter === '-') {
        $letterDiv.addClass('special-char nonclickable');
      }

      $letterDiv.appendTo($letters)
        .addClass('letter')
        .after(' ');

      var $letterSpan = $('<div />')
        .toggleClass('char', letter.letter !== '')
        .text(letter.letter || '');
      $letterSpan.appendTo($letterDiv);

      if (options.icons && letter.thumbnail) {
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
    if (typeof options.letters !== 'boolean') {
      $book = $(options.letters);
    }

    if (!$book || !$book.length) {
      $book = data.html.parents('[data-key="lmn-book"]');
    }

    data.lettersElement = $lettersContainer.prependTo($book);

    if (options.icons) {
      $lettersContainer.parents('#monkey').addClass('monkey-icons');
    }

    return data;
  };
};

function combineLetters(splitLetters, dataLetters) {
  var offset = 0;

  return $.map(splitLetters, function (val, i) {
    var idx = i;
    if (splitLetters.length > 5) {
      idx = i - offset;
    }
    if (val === '-' || val === ' ') {
      offset++;
      return { letter: val };
    }

    dataLetters[idx].letter = val;
    return dataLetters[idx];
  });
}
