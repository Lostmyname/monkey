'use strict';

/**
 * Adds a buy now button to landscape mobile monkey.
 */
module.exports = function () {
  return function (data) {
    if (data.monkeyType !== 'mobile') {
      return data;
    }

    data.buyNow = $('<a />')
      .addClass('buy-now')
      .attr('href', '#0') // @todo: add proper href
      .html('Buy now &rarr;') // @todo: Localise
      .appendTo(data.html.parents('[data-key="lmn-book"]'));

    return data;
  };
};
