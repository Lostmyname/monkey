'use strict';

var $ = require('jquery');
// var isMobile = require('../../helpers/isMobile')();

/**
 * Generate HTML for letters.
 *
 * @param {object} options Options object from monkey.
 */
module.exports = function (options) {
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
      .text(options.lang.bookFor);

    var $letterSpanContainer = $('<div />').appendTo($lettersContainer)
      .addClass('letter-spans');

    var $letters = $('<div />').appendTo($letterSpanContainer)
      .addClass('strong')
      .attr('id', 'letters');

    var letters = data.name.split('');

    // Get the total letters, by finding just the first part of each letter
    var dataLetters = $(data.letters).filter(function (i, letter) {
      return letter.part === 1;
    });

    // If name short, add blank letter for extra story
    var paddedLetters = $.map(letters, function (el) {
      if (el !== '' && el !== '-') {
        return el;
      }
    });
    // The minimum length for a name is 4 but we allow a space or a -
    // so the total minimum length is 5
    var shortNameMinimumLength = 5;
    if (paddedLetters.length <= shortNameMinimumLength) {
      letters.splice(-1, 0, '');
    }
    var combinedLetters = data.combinedLetters = combineLetters(letters, dataLetters);

    // Whether we should show the duplicate letters modal if more than one
    // book has been created. We return an integer if true because we need to
    // change the wording on the overlay if it's a single letter, or multiple.
    var determineIfDuplicate = function () {
      var outcome = false;
      $(combinedLetters).each(function (i, letter) {
        if (letter.changed) {
          outcome++;
        }
      });
      return outcome;
    };

    data.shouldShowDuplicateModal = determineIfDuplicate();

    var loadLetterCards = function () {
      $(combinedLetters).each(function (i, letter) {
        var $letterDiv = $('<div />');

        if (letter.letter === ' ' || letter.letter === '-') {
          $letterDiv.addClass('special-char nonclickable');
        }

        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        // Create the letter HTML, and add a whole bunch of data attributes
        // that we can access for targeting the appropriate letter when using
        // the character picker.
        $letterDiv.appendTo($letters)
          .addClass('letter')
          .attr('data-letter', letter.letter)
          .attr('data-character', letter.default_character)
          .attr('data-selected-character', letter.selected)
          .attr('data-type', letter.type)
          .after(' ');
        if (letter.thumbnail && letter.thumbnail.indexOf('helper') !== -1) {
          $letterDiv.attr('data-helper-character', true);
        }
        // If we're showing the duplicate letter overlay, and this is one of the
        // duplicate letters, we add a class to show visually that this is a
        // changed letter.
        if (letter.selected !== letter.default_character && options.showOverlay) {
          $letterDiv.addClass('changed');
        }
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        var $letterSpan = $('<div />')
          .toggleClass('char', letter.letter !== '')
          .text(letter.letter || '');
        $letterSpan.appendTo($letterDiv);

        if (options.icons && letter.thumbnail) {
          var $characterCard = $('<div />');
          $characterCard.appendTo($letterDiv)
            .addClass('character-card');

          var $icon = $('<img />')
            .attr('src', letter.thumbnail)
            .attr('height', 38)
            .attr('width', 38);
          $icon.appendTo($characterCard);
        }
        defer.resolve();
      });
      return defer.promise();
    };

    return loadLetterCards()
      .then(function () {
        // After we've loaded the name, we add the two circles either side of
        // the name for the front and back covers.
        $('<div />').html('<div class="char">&bull;</div>')
          .prependTo($letters)
          .addClass('letter letter--cover')
          .after(' ')
          .clone().appendTo($letters);

        var $book = false;
        if (typeof options.letters !== 'boolean') {
          $book = $(options.letters);
        }
        if (!$book || !$book.length) {
          $book = data.monkeyContainer;
        }
        // We replicate some functionality from js/generateBaseElement.js here,
        // removing all current content within the container, adding the
        // letters element to the DOM (and saving it to the data object), and
        // adding the loading gif in whilst the book loads.
        $book.empty();
        data.lettersElement = $lettersContainer.appendTo($book);
        data.loading = data.loading.appendTo($book);

        if (options.icons) {
          $lettersContainer.parents('#monkey').addClass('monkey-icons');
        }
        return data;
      });
  };
};
/**
 * We combine letters from the name passed through to Monkey as an option,
 * with the letters array brought back from the server.
 * @param  {array} splitLetters The letters in the options
 * @param  {array} dataLetters  The letters from the server
 * @return {array}              A combined array of both letters, mapped.
 */
function combineLetters(splitLetters, dataLetters) {
  var offset = 0;
  return $.map(splitLetters, function (val, i) {
    var idx = i;
    if (splitLetters.length > 5) {
      idx = i - offset;
    }
    dataLetters[idx].changed =
      dataLetters[idx].selected !== dataLetters[idx].default_character;

    if (val === '-' || val === ' ') {
      offset++;
      return { letter: val };
    }

    dataLetters[idx].letter = val;
    return dataLetters[idx];
  });
}
