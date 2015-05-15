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
    var defaultChars = data.default_characters;

    $(allChars).each(function (ix, characterSet) {
      $(characterSet.characters).each(function (i, charObj) {
        if (charObj.character === defaultChars[ix].character) {
          characterSet.selected = charObj.character;
        }
      })
    })

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

    var $divider = $('<hr />');

    $(data.letters).filter(function (i, letter) {
      return letter.part === 1;
    }).each(function (i, letter) {
      var $letterSpan = $('<span />');
      $letterSpan.appendTo($letters)
        .text(letter.letter || '')
        .after(' ');

      var $characterCard = $('<div />');
      $characterCard.appendTo($letterSpan)
        .addClass('character-card');

      var $charCardImg = $('<img />')
        .attr('src', '//lmn-assets.imgix.net/characters/en-GB/thumbs/' + allChars[i].selected + '_200x200.png');
      $charCardImg.appendTo($characterCard);

      var $toolTip = $('<div />');
      $toolTip.appendTo($letterSpan)
        .addClass('character-picker pos-absolute');

      var $charPickTitle = $('<div />')
        .text('Choose another story for ‘' + letter.letter + '’')
        .addClass('title');

      $charPickTitle.appendTo($toolTip)

      var $charContainer = $('<div />')
        .addClass('char-container')
      $charContainer.appendTo($toolTip)
      $toolTipArrow.clone().prependTo($toolTip);

      var letterChars = allChars[i]
      $(letterChars.characters).each(function (ix, charObj) {
        var $imgContainer = $('<div />')
          .addClass('img-container');

        var $img = $('<img />')
          .attr('src', '//lmn-assets.imgix.net/characters/en-GB/thumbs/' + charObj.character + '_200x200.png')
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
        if (letterChars.selected == charObj.character) {
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
        $selectButton.appendTo($charName)
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
