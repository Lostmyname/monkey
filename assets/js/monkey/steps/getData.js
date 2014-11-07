'use strict';

/**
 * Gets the data from the server.
 *
 * @returns {object} (via promise) Object with a number of properties such as
 *                   name and gender, and then a letters property containing
 *                   information on the pages. Seriously, just use a debugger.
 */
module.exports = function () {
  return $.post(this.options.server, { widget: this.options.book })
    .then(function (data) {
      data.book.bookTipTap = '//lmn-assets.imgix.net/widget/en-GB/v2/images/book_tip.png';
      data.book.bookTipSwipe = '/assets/lostmyname/widget/book-swipe.png';

      return data.book;
    });
};
