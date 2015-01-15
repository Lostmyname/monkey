'use strict';

/**
 * Generate HTML for letters.
 *
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 */
module.exports = function (selector, lang) {
  if (typeof lang === 'undefined' && typeof selector === 'object') {
    lang = selector;
    selector = true;
  }

  return function (data) {
    var $lettersContainer = $('<div />');

    $lettersContainer.attr({
      id: 'letters-container',
      'class': 'aligned-center row leaded',
      'data-key': 'monkey-letters'
    });

    $('<p />').appendTo($lettersContainer)
      .addClass('unleaded')
      .text(lang.bookFor);

    var $letters = $('<span />').appendTo($lettersContainer)
      .addClass('strong')
      .attr('id', 'letters');

    $(data.letters).filter(function (i, letter) {
      return letter.part === 1;
    }).each(function (i, letter) {
      $('<span />').appendTo($letters)
        .text(letter.letter || '')
        .after(' ');
    });

    $('<span />').html('&bull;')
      .prependTo($letters)
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

    return data;
  };
};
