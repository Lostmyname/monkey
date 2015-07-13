'use strict';

var $ = require('jquery');

/**
 * Gets the data from the server.
 *
 * @returns {object} (via promise) Object with a number of properties such as
 *                   name and gender, and then a letters property containing
 *                   information on the pages. Seriously, just use a debugger.
 */
module.exports = function (options) {
  //var locale = options.book.locale;

  return $.getJSON(options.server, { widget: options.book })
    .then(function (data) {
      return data.book;
    });
};
