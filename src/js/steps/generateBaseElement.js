'use strict';

/**
 * Generate base HTML element for all of monkey.
 *
 * Varies depending on the browser.
 *
 */
module.exports = function (monkeyContainer, options) {
  return function (data) {
    if (options.replaceMonkey) {
      monkeyContainer.empty();
    }
    monkeyContainer.addClass(data.monkeyType);
    data.base = monkeyContainer;
    data.monkeyContainer = monkeyContainer;

    return data;
  }.bind(this);
};
