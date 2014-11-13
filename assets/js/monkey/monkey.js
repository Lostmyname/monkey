window.monkey = module.exports = (function () {
  'use strict';

  var monkey = {};
  monkey.IMAGE_RATIO = 2048 / 738;

  /**
   * Initiate monkey; generate it, and then insert it into the page.
   *
   * @param {string|HTMLElement|jQuery} monkeyContainer Container for monkey.
   * @param {object} options Options! Read the code. Sorry.
   * @returns A promise that will be resolved when monkey is ready.
   */
  monkey.init = function (monkeyContainer, options) {
    var $monkeyContainer = $(monkeyContainer);

    monkey.options = options = $.extend({
      buyNow: '#0', // Buy now link, or false for no link
      letters: true, // Display letters? true, false, or selector
      monkeyType: 'auto', // auto, desktop, mobile

      server: 'https://secure.lostmy.name/widgets.json',

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

    var promise = monkey._getData(options)
      .then(monkey._calculateMonkey(options.monkeyType))
      .then(monkey._generateUrls())
      .then(monkey._generateHtml())
      .then(monkey._initMonkey())
      .then(monkey._insertHtml(monkeyContainer))
      .then(function (data) {
        if (data.needsSpread) {
          monkey.spread._getData(data, monkey)
            .then(monkey.spread._insertSpread());
        }

        return data;
      });

    if (options.letters) {
      promise = promise.then(monkey.letters._generateHtml(options.letters))
        .then(monkey.letters._init());
    }

    if (options.buyNow) {
      promise = promise.then(monkey._addBuyNow(options.buyNow));
    }

    return promise;
  };

  monkey._getData = require('./steps/getData');
  monkey._calculateMonkey = require('./steps/calculateMonkey');
  monkey._generateUrls = require('./steps/generateUrls');
  monkey._generateHtml = require('./steps/generateHtml');
  monkey._initMonkey = require('./steps/initMonkey');
  monkey._insertHtml = require('./steps/insertHtml');

  monkey._addBuyNow = require('./steps/addBuyNow');

  monkey.spread = {};
  monkey.spread.monkey = monkey;
  monkey.spread._getData = require('./steps/spread/getData');
  monkey.spread._insertSpread = require('./steps/spread/insertSpread');

  monkey.letters = {};
  monkey.letters.monkey = monkey;
  monkey.letters._generateHtml = require('./steps/letters/generateHtml');
  monkey.letters._init = require('./steps/letters/init');

  monkey.helpers = {};
  monkey.helpers.monkey = monkey;
  monkey.helpers.handleReplace = require('./helpers/handleReplace');
  monkey.helpers.isMobile = require('./helpers/isMobile');

  monkey.monkeys = {};
  monkey.monkeys.mobile = require('./monkeys/mobile');
  monkey.monkeys.mobile.monkey = monkey;
  monkey.monkeys.desktop = require('./monkeys/desktop');
  monkey.monkeys.desktop.monkey = monkey;

  return monkey;
})();
