'use strict';

/**
 * Generate base HTML element for all of monkey.
 *
 * Varies depending on the browser.
 *
 */
module.exports = function () {
  return function (data) {
    data.html = this.monkeys[data.monkeyType].generateBaseElement(data);

    return data;
  }.bind(this);
};

