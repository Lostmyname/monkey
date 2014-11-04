'use strict';

/**
 * Adds a buy now button to landscape mobile monkey.
 */
module.exports = function () {
  var monkey = this;

  return function (data) {
    if (data.monkeyType !== 'mobile') {
      return data;
    }

    data.buyNow = $('<a />')
      .addClass('buy-now')
      .attr('href', '#0') // @todo: add proper href
      .html(monkey.options.lang.buyNow + ' &rarr;')
      .appendTo(data.html.parents('[data-key="lmn-book"]'));

    return data;
  };
};
