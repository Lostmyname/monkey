'use strict';

/**
 * Adds a buy now button to landscape mobile monkey.
 */
module.exports = function (buyNowLink) {
  var monkey = this;

  return function (data) {
    if (data.monkeyType !== 'mobile') {
      return data;
    }

    data.buyNow = $('<a />')
      .addClass('buy-now')
      .html(monkey.options.lang.buyNow + ' &rarr;')
      .appendTo(data.html.parents('[data-key="lmn-book"]'));

    if (typeof buyNowLink === 'string') {
      data.buyNow.attr('href', buyNowLink);
    } else if (buyNowLink instanceof jQuery) {
      data.buyNow.on('click', function (e) {
        e.preventDefault();

        buyNowLink.trigger('click');
      });
    }

    return data;
  };
};
