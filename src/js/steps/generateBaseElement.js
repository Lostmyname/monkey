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
    data.base = this.monkeys[data.monkeyType].generateBaseElement(data);
    data.monkeyContainer = monkeyContainer;
    // monkeyContainer.append(data.base);

    return data;
  }.bind(this);
};

