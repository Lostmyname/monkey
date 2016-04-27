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
  var returnPromise;
  if (!options.platformAPI) {
    returnPromise = $.getJSON(options.server, { book: options.book })
      .then(function (data) {
        // For backwards compatibility
        if (!data.book.spreads) {
          data.book.spreads = 'double';
        }

        return data.book;
      });
  } else {
    console.log('options', options);
    returnPromise = $.ajax({
      dataType: 'JSON',
      url: options.server + 'product-builder/tjh/images',
      data: options.book
    })
      .then(function (data) {
        var transformedData = {
          book: {
            spreads: 'single',
            letters: data.images.map(function (image) {
              return {
                url: image.url,
                id: image.id,
                type: 'story'
              };
            })
          }
        };
        return transformedData.book;
      });
  }
  return returnPromise;
};
