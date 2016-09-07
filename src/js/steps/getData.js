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
        // For backwards compatibility
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
            letters: generatePlatformURLs(data)
          }
        };
        return transformedData.book;
      });
  }
  return returnPromise;
};

function generatePlatformURLs(data) {
  var dynamicPages = data.images.map(function (image) {
    return {
      url: image.url,
      id: image.id,
      type: 'story'
    };
  });

  var frontPages = [
    {
      url: 'https://tjh-preview-images.imgix.net/TheJourneyHome_FrontCover_RGB.jpg',
      id: 'front-cover',
      type: 'static'
    },
    {
      url: 'https://tjh-preview-images.imgix.net/TheJourneyHome_Cover_RGB_FrontInsideCover_RGB.jpg',
      id: 'front-cover-inside',
      type: 'static'
    }
  ];

  var backPages = [
    {
      url: 'https://tjh-preview-images.imgix.net/TheJourneyHome_BarcodePage_RGB.jpg',
      id: 'back-cover',
      type: 'static'
    },
    {
      url: 'https://tjh-preview-images.imgix.net/TheJourneyHome_BackInsideCover_RGB.jpg',
      id: 'back-cover',
      type: 'static'
    },
    {
      url: 'https://tjh-preview-images.imgix.net/TheJourneyHome_BackCover_RGB.jpg',
      id: 'back-cover',
      type: 'static'
    }
  ];

  return [].concat(frontPages, dynamicPages, backPages);
}

function trimTrailingSlash(str) {
  return str.replace(/\/+$/, '');
}

function trimLeadingSlash(str) {
  return str.replace(/^\//, '');
}
