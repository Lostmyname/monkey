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
      url: '/product-builder/tjh/image?name=jack&gender=boy&locale=en-GB&phototype=type-ii&door_number=96&street=Cavendish+Drive&city=london&country_code=gb&lat=51.568001&lng=-0.000738&inscription=test&page_id=1',
      id: 'front-cover',
      type: 'special'
    },
    {
      url: '/product-builder/tjh/image?name=jack&gender=boy&locale=en-GB&phototype=type-ii&door_number=96&street=Cavendish+Drive&city=london&country_code=gb&lat=51.568001&lng=-0.000738&inscription=test&page_id=1',
      id: 'front-cover-inside',
      type: 'story'
    }
  ];

  var backPages = [
    {
      url: '/product-builder/tjh/image?name=jack&gender=boy&locale=en-GB&phototype=type-ii&door_number=96&street=Cavendish+Drive&city=london&country_code=gb&lat=51.568001&lng=-0.000738&inscription=test&page_id=1',
      id: 'back-cover',
      type: 'story'
    },
    {
      url: '/product-builder/tjh/image?name=jack&gender=boy&locale=en-GB&phototype=type-ii&door_number=96&street=Cavendish+Drive&city=london&country_code=gb&lat=51.568001&lng=-0.000738&inscription=test&page_id=1',
      id: 'back-cover',
      type: 'story'
    },
    {
      url: '/product-builder/tjh/image?name=jack&gender=boy&locale=en-GB&phototype=type-ii&door_number=96&street=Cavendish+Drive&city=london&country_code=gb&lat=51.568001&lng=-0.000738&inscription=test&page_id=1',
      id: 'back-cover',
      type: 'story'
    }
  ];

  return [].concat(frontPages, dynamicPages, backPages);
}
