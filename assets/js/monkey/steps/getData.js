'use strict';

/**
 * Gets the data from the server.
 *
 * @returns {object} (via promise) Object with a number of properties such as
 *                   name and gender, and then a letters property containing
 *                   information on the pages. Seriously, just use a debugger.
 */
module.exports = function () {
  var locale = this.options.book.locale;

  return $.post(this.options.server, { widget: this.options.book })
    .then(function (data) {
      var base = '//lmn-assets.imgix.net/widget/' + locale + '/v2';

      data.book.bookTipTap = base + '/images/book_tip.png';
      data.book.bookTipSwipe = base + '/images/first_page.jpg';
      data.book.lastPage = base + '/images/last_page.jpg';

      return data.book;
    });
};
