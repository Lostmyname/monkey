'use strict';

var $ = require('jquery');
var removeDiacritics = require('diacritics').remove;

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
    var allChars = data.all_characters;

    $lettersContainer.attr({
      id: 'letters-container',
      'class': 'aligned-center row leaded md-mar-b', // @todo: remove leaded
      'data-key': 'monkey-letters'
    });

    $('<p />').appendTo($lettersContainer)
      .addClass('unleaded no-mar') // @todo: remove unleaded when eagle dead
      .text(lang.bookFor);

    var $letters = $('<span />').appendTo($lettersContainer)
      .addClass('strong')
      .attr('id', 'letters');

    var $toolTipArrow = $('<img />')
      .addClass('tooltip-arrow')
      .attr('src', '/src/imgs/tooltip-arrow-85x47.png');

    var $charContainer = $('<div />')
      .addClass('char-container')

    $(data.letters).filter(function (i, letter) {
      return letter.part === 1;
    }).each(function (i, letter) {
      var $letterSpan = $('<span />');
      $letterSpan.appendTo($letters)
        .text(letter.letter || '')
        .after(' ');

      var $toolTip = $('<div />');
      $toolTip.appendTo($letterSpan)
        .addClass('character-picker pos-absolute');

      var $charPickTitle = $('<p />')
        .text('Choose another story for ‘' + letter.letter + '’');
      $charPickTitle.appendTo($toolTip)
      $charContainer.clone().appendTo($toolTip)
      $toolTipArrow.clone().prependTo($toolTip);

      $(allChars[i].characters).each(function (i, character) {
        var $imgContainer = $('<div />')
          .addClass('img-container');
        var $img = $('<img />')
          .attr('src', '//lmn-assets.imgix.net/characters/en-GB/' + character + '.png')
          .addClass('character-image');
        var $charName = $('<div />')
          .addClass('character-name')
          .text(character);
        $imgContainer.appendTo($charContainer);
        $img.appendTo($imgContainer);
        $charName.appendTo($imgContainer);
      })
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
