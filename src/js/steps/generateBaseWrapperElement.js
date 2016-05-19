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
    var classes = data.monkeyType === 'mobile' ?
                  'monkey-wrapper mobile' :
                  'positioned-relative pos-relative monkey-wrapper desktop';

    data.$monkeyWrapper = $('<div />').addClass(classes);
    data.$monkeyWrapper.appendTo($monkeyContainer);

    return data;
  };
};
