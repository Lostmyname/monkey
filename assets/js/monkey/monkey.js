window.monkey = module.exports = (function () {
  'use strict';

  var monkey = {};
  monkey._urls = require('./urls');
  monkey.IMAGE_RATIO = 2048 / 738;

  /**
   * Initiate monkey; generate it, and then insert it into the page.
   *
   * @param {string|HTMLElement|jQuery} monkeyContainer Container for monkey.
   * @param {object} options Options! Read the code. Sorry.
   * @returns A promise that will be resolved when monkey is ready.
   */
  monkey.init = function (monkeyContainer, options) {
    options = $.extend({
      letters: true, // Display letters? true, false, or selector
      monkeyType: 'auto' // auto, desktop, mobile
    }, options);

    var promise = monkey._getData()
      .then(monkey._generateUrls())
      .then(monkey._calculateMonkey(options.monkeyType))
      .then(monkey._generateHtml())
      .then(monkey._initMonkey())
      .then(monkey._insertHtml(monkeyContainer));

    if (options.letters) {
      promise = promise.then(monkey.letters._generateHtml())
        .then(monkey.letters._init());
    }

    return promise;
  };

  monkey._getData = require('./steps/getData');
  monkey._generateUrls = require('./steps/generateUrls');
  monkey._calculateMonkey = require('./steps/calculateMonkey');
  monkey._generateHtml = require('./steps/generateHtml');
  monkey._initMonkey = require('./steps/initMonkey');
  monkey._insertHtml = require('./steps/insertHtml');

  monkey.letters = {};
  monkey.letters._generateHtml = require('./steps/letters/generateHtml');
  monkey.letters._init = require('./steps/letters/init');

  monkey.helpers = {};
  monkey.helpers.handleReplace = require('./helpers/handleReplace');
  monkey.helpers.isMobile = require('./helpers/isMobile');

  monkey.monkeys = {};
  monkey.monkeys.mobile = require('./monkeys/mobile');
  monkey.monkeys.desktop = require('./monkeys/desktop');

  return monkey;
})();
