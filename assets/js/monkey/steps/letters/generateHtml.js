'use strict';

/**
 * Generate HTML for letters.
 *
 * @param {string} [selector] Selector or element to insert letters into.
 */
module.exports = function (selector) {
  return function (data) {
    var $lettersContainer = $('<div />');

    $lettersContainer.attr({
      id: 'letters-container',
      'class': 'aligned-center row leaded',
      'data-key': 'monkey-letters'
    });

    $('<p />').appendTo($lettersContainer)
      .addClass('unleaded')
      .text('A personalised book made for'); // @todo: Localise

    var $letters = $('<span />').appendTo($lettersContainer)
      .addClass('strong')
      .attr('id', 'letters');

    $.each(data.name.split(''), function (i, letter) {
      $('<span />').appendTo($letters).text(letter).after(' ');
    });

    $('<span />').html('&bull;')
      .prependTo($letters)
      .after(' ')
      .clone().appendTo($letters);

    var $book = false;
    if (typeof selector !== 'undefined' && typeof selector !== 'boolean') {
      $book = $(selector);
    }

    if (!$book || !$book.length) {
      $book = data.html.parents('[data-key="lmn-book"]');
    }

    data.letters = $lettersContainer.prependTo($book);

    return data;
  };
};
