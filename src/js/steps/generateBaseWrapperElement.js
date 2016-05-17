'use strict';
var $ = require('jquery');

/**
 * Generate base HTML element for all of monkey.
 *
 * Varies depending on the browser.
 *
 */
module.exports = function ($monkeyContainer) {
  return function (data) {
    if (data.monkeyType === 'mobile') {
      data.$monkeyWrapper = $('<div />').addClass('monkey-wrapper mobile');
    } else {
      data.$monkeyWrapper = $('<div />')
        .addClass('pos-relative positioned-relative monkey-wrapper desktop');
    }

    data.$monkeyWrapper.appendTo($monkeyContainer);

    return data;
  };
};
