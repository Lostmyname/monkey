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
  var url = options.serverPath
    ? trimTrailingSlash(options.server) + '/' + trimLeadingSlash(options.serverPath)
    : options.server;

  if (!options.platformAPI) {
    returnPromise = $.getJSON(options.server, { book: options.book })
      .then(function (data) {
        if (!data) {
          data = {};
        }
        if (!data.book) {
          data.book = {};
        }
        if (!data.book.spreads) {
          data.book.spreads = 'double';
        }

        return data.book;
      });
  } else {
    returnPromise = $.ajax({
      dataType: 'JSON',
      url,
      data: options.book
    })
      .then(function (data) {
        var transformedData = {
          book: {
            spreads: 'single',
            letters: generatePlatformURLs(data, options)
          }
        };
        return transformedData.book;
      });
  }
  return returnPromise;
};

function generatePlatformURLs(data, options) {
  var dynamicPages = data.images.map(function (image) {
    return {
      url: image.url,
      id: image.id,
      type: 'story'
    };
  });

  return [].concat(options.frontPages || [], dynamicPages, options.backPages || []);
}

function trimTrailingSlash(str) {
  return str.replace(/\/+$/, '');
}

function trimLeadingSlash(str) {
  return str.replace(/^\//, '');
}
