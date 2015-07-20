'use strict';

/**
 * Generate base HTML element for all of monkey.
 *
 * Varies depending on the browser.
 *
 */
module.exports = function (monkeyContainer, options) {
  return function (data) {

    data.loading = monkeyContainer.find('.loader-img').clone();

    if (options.replaceMonkey) {
      monkeyContainer.empty();
      data.loading = data.loading.appendTo(monkeyContainer);
    }

    monkeyContainer.addClass(data.monkeyType);
    data.base = monkeyContainer;
    data.monkeyContainer = monkeyContainer;

    return data;
  }.bind(this);
};

