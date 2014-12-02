'use strict';

/**
 * Gets the data from the server.
 *
 * @returns {object} (via promise) Object with a number of properties such as
 *                   name and gender, and then a letters property containing
 *                   information on the pages. Seriously, just use a debugger.
 */
module.exports = function (options) {
  var locale = options.book.locale;

  return $.getJSON(options.server, { widget: options.book })
    .then(function (data) {
      var baseBase = '//lmn-assets.imgix.net/widget';
      var base = baseBase + '/' + locale + '/v2';

      data.book.bookTipTap = base + '/images/book_tip.png';
      data.book.bookTipSwipe = base + '/images/first_page.jpg';
      data.book.monkeySwipe = baseBase + '/v2/monkey_swipe.gif';
      data.book.lastPage = base + '/images/last_page.jpg';

      return data.book;
    });
};
