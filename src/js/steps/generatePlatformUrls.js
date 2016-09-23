'use strict';

var $ = require('jquery');
/**
 * Generates the image URLs from Imgix, which are prepped and optimized for the
 * users's screen size and device resolution.
 *
 * @param  {int} preload Number of images to preload on initialisation.
 * @return {data} The data object passed through the Promise chain.
 */
module.exports = function (options) {
  var helpers = this.helpers;

  /**
   * Takes data and turns letters into URLs.
   */
  return function (data) {
    var width = Math.round((data.$monkeyWrapper.width() / 2) * (window.devicePixelRatio > 1 ? 2 : 1));
    // data.urls is a list of the raw image URLs, not resized or compressed.
    data.urls = $.map(data.letters, function (letterData) {
      var url = (letterData.type === 'static')
        ? `${letterData.url}?w=${width}`
        : `${options.server}${letterData.url}&width=${width}`;

      return url;
    });

    return helpers.preload(data.urls.slice(0, options.preload))
      .then(function () {
        return data;
      });
  };
};
