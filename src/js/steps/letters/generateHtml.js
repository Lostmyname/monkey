'use strict';

var $ = require('jquery');

/**
 * Generate HTML for letters.
 *
 * @param {object} options Monkey options.
 */
module.exports = function (options) {
  return function (data) {
    var $lettersContainer = $('<div />');

    $lettersContainer.attr({
      id: 'letters-container',
      'class': 'aligned-center row md-mar-b',
      'data-key': 'monkey-letters'
    });

    $('<p />').appendTo($lettersContainer)
      .addClass('no-mar')
      .text(options.lang.bookFor);

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
        .addClass('letter letter-hidden')
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
    if (typeof options.selector !== 'boolean') {
      $book = $(options.selector);
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

var combineLetters = function (splitLetters, dataLetters) {
  var offset = 0;
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
};
