window.Monkey = module.exports = (function () {
  var $ = require('jquery');

  /**
   * Initiate monkey; generate it, and then insert it into the page.
   *
   * @param {string|HTMLElement|jQuery} monkeyContainer Container for monkey.
   * @param {object} options Options! Read the code. Sorry.
   */
  function Monkey(monkeyContainer, options) {
    var $monkeyContainer = $(monkeyContainer);

    this.options = options = $.extend({
      preload: 3, // Number of pages to preload
      letters: true, // Display letters? true, false, or selector
      icons: $monkeyContainer.data('icons'), // Display character icons under letters? true, false
      monkeyType: 'auto', // auto, desktop, mobile
      animateName: true,
      replaceMonkey: false,
      showCharPicker: true,

      // server: 'https://secure.lostmy.name/widgets/actuallymonkey.json?callback=?',
      server: 'http://lostmyname-staging.herokuapp.com/widgets/actuallymonkey.json?callback=?',

      book: {
        name: $monkeyContainer.data('name'),
        gender: $monkeyContainer.data('gender'),
        locale: $monkeyContainer.data('locale')
      },

      lang: {
        bookFor: 'A personalised book made for',
        noAltText: 'No alternative text for this page, sorry.'
      }
    }, options);

    if ($monkeyContainer.data('first-book-name')) {
      options.book.comparisonBooks = [
        {
          name: $monkeyContainer.data('first-book-name'),
          gender: $monkeyContainer.data('first-book-gender'),
          locale: $monkeyContainer.data('first-book-locale'),
        }
      ];
    }

    this.$events = $({});

    var promise = Monkey._getData(options)
      .then(Monkey._calculateMonkey(options.monkeyType))
      .then(Monkey._generateBaseElement($monkeyContainer, options));
    if (options.letters) {
      promise = promise.then(Monkey.letters._generateHtml(options));
      if (options.showCharPicker) {
        promise = promise.then(Monkey.letters._generateCharPicker(
            options.letters,
            options.lang,
            options.icons,
            $monkeyContainer
          )
        );
      }
      promise = promise.then(Monkey.letters._init(this.$events, options));
    }

    promise = promise
      .then(Monkey._generateUrls(options.preload))
      .then(Monkey._generateHtml(options.lang))
      .then(Monkey._insertHtml(monkeyContainer, options))
      .then(Monkey._initMonkey(this.$events));

    if (options.book.comparisonBooks) {
      promise = promise.then(Monkey.letters._generateOverlay(options, this.$events));
    }
    promise = promise.then(function (data) {
        if (data.needsSpread) {
          Monkey.spread._getData(data, options)
            .then(Monkey.spread._insertSpread());
        }

        return data;
      });

    this.promise = promise;
  }

  Monkey._getData = require('./steps/getData');
  Monkey._generateBaseElement = require('./steps/generateBaseElement');
  Monkey._calculateMonkey = require('./steps/calculateMonkey');
  Monkey._generateUrls = require('./steps/generateUrls');
  Monkey._generateHtml = require('./steps/generateHtml');
  Monkey._insertHtml = require('./steps/insertHtml');
  Monkey._initMonkey = require('./steps/initMonkey');

  Monkey.spread = {};
  Monkey.spread.Monkey = Monkey;
  Monkey.spread._getData = require('./steps/spread/getData');
  Monkey.spread._insertSpread = require('./steps/spread/insertSpread');

  Monkey.letters = {};
  Monkey.letters.Monkey = Monkey;
  Monkey.letters._generateHtml = require('./steps/letters/generateHtml');
  Monkey.letters._generateCharPicker = require('./steps/letters/generateCharPicker');
  Monkey.letters._init = require('./steps/letters/init');
  Monkey.letters._generateOverlay = require('./steps/letters/generateOverlay');

  Monkey.helpers = {};
  Monkey.helpers.Monkey = Monkey;
  Monkey.helpers.handleReplace = require('./helpers/handleReplace');
  Monkey.helpers.isMobile = require('./helpers/isMobile');
  Monkey.helpers.preload = require('./helpers/preload');

  Monkey.monkeys = {};
  Monkey.monkeys.mobile = require('./monkeys/mobile');
  Monkey.monkeys.mobile.Monkey = Monkey;
  Monkey.monkeys.desktop = require('./monkeys/desktop');
  Monkey.monkeys.desktop.Monkey = Monkey;

  return Monkey;
})();
