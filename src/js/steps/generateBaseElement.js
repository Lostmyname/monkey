'use strict';

/**
 * Generate base HTML element for all of monkey.
 *
 * Varies depending on the browser.
 *
 */
module.exports = function (monkeyContainer, options) {
  return function (data) {

    if (options.replaceMonkey && !options.showCharPicker) {
      monkeyContainer.empty();
    } else if (!options.replaceMonkey && options.showCharPicker) {
      monkeyContainer.next('.italic').hide();
    }
    monkeyContainer.addClass(data.monkeyType);
    data.base = monkeyContainer;
    data.monkeyContainer = monkeyContainer;

    return data;
  }.bind(this);
};

