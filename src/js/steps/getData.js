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
    console.log('options.server', options.server);
    returnPromise = $.ajax({
      dataType: 'JSON',
      url: options.server + 'product-builder/tjh/images',
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
      url: 'https://s3-eu-west-1.amazonaws.com/tjh-preview-assets/TheJourneyHome_FrontCover_RGB.jpg',
      id: 'front-cover',
      type: 'static'
    },
    {
      url: 'https://s3-eu-west-1.amazonaws.com/tjh-preview-assets/TheJourneyHome_Cover_RGB_FrontInsideCover_RGB.jpg',
      id: 'front-cover-inside',
      type: 'static'
    }
  ];

  var backPages = [
    {
      url: 'https://s3-eu-west-1.amazonaws.com/tjh-preview-assets/TheJourneyHome_BarcodePage_RGB.jpg',
      id: 'back-cover',
      type: 'static'
    },
    {
      url: 'https://s3-eu-west-1.amazonaws.com/tjh-preview-assets/TheJourneyHome_BackInsideCover_RGB.jpg',
      id: 'back-cover',
      type: 'static'
    },
    {
      url: 'https://s3-eu-west-1.amazonaws.com/tjh-preview-assets/TheJourneyHome_BackCover_RGB.jpg',
      id: 'back-cover',
      type: 'static'
    }
  ];

  return [].concat(frontPages, dynamicPages, backPages);
}
