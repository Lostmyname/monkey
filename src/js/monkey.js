window.Monkey = module.exports = (function () {
  'use strict';

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
      buyNow: '#0', // Buy now link, or false for no link
      preload: 3, // Number of pages to preload
      letters: true, // Display letters? true, false, or selector
      monkeyType: 'auto', // auto, desktop, mobile

      server: 'https://secure.lostmy.name/widgets/actuallymonkey.json?callback=?',

      book: {
        name: $monkeyContainer.data('name'),
        gender: $monkeyContainer.data('gender'),
        locale: $monkeyContainer.data('locale')
      },

      lang: {
        buyNow: 'Buy now',
        bookFor: 'A personalised book made for'
      }
    }, options);

    this.$events = $({});

    var promise = Monkey._getData(options)
      .then(Monkey._calculateMonkey(options.monkeyType))
      .then(Monkey._generateUrls(options.preload))
      .then(Monkey._generateHtml())
      .then(Monkey._initMonkey(this.$events))
      .then(Monkey._insertHtml(monkeyContainer))
      .then(function (data) {
        if (data.needsSpread) {
          Monkey.spread._getData(data, options)
            .then(Monkey.spread._insertSpread());
        }

        return data;
      });

    if (options.letters) {
      promise = promise.then(Monkey.letters._generateHtml(options.letters, options.lang))
        .then(Monkey.letters._init(this.$events));
    }

    if (options.buyNow) {
      promise = promise.then(Monkey._addBuyNow(options.buyNow, options.lang));
    }

    this.promise = promise;
  }

  Monkey.IMAGE_RATIO = 2048 / 738;

  Monkey._getData = require('./steps/getData');
  Monkey._calculateMonkey = require('./steps/calculateMonkey');
  Monkey._generateUrls = require('./steps/generateUrls');
  Monkey._generateHtml = require('./steps/generateHtml');
  Monkey._initMonkey = require('./steps/initMonkey');
  Monkey._insertHtml = require('./steps/insertHtml');

  Monkey._addBuyNow = require('./steps/addBuyNow');

  Monkey.spread = {};
  Monkey.spread.Monkey = Monkey;
  Monkey.spread._getData = require('./steps/spread/getData');
  Monkey.spread._insertSpread = require('./steps/spread/insertSpread');

  Monkey.letters = {};
  Monkey.letters.Monkey = Monkey;
  Monkey.letters._generateHtml = require('./steps/letters/generateHtml');
  Monkey.letters._init = require('./steps/letters/init');

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
