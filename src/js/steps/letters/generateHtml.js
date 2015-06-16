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
    var allChars = data.all_characters;
    var defaultChars = data.default_characters;

    $(allChars).each(function (ix, characterSet) {
      $(characterSet.characters).each(function (i, charObj) {
        if (charObj.character === defaultChars[ix].character) {
          characterSet.selected = charObj.character;
        }
      });
    });

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

    var $toolTipArrow = $('<img />')
      .addClass('tooltip-arrow')
      .attr('src', '/src/imgs/tooltip-arrow-85x47.png');
    var letters = data.name.split('');
    var dataLetters = $(data.letters).filter(function (i, letter) {
      return letter.part === 1;
    });

    var $divider = $('<hr />');
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
            .attr('src', charObj.thumbnail)
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
          $selectButton.appendTo($charName);
        });
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
