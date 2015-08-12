'use strict';

var $ = require('jquery');
/**
 * Generates the image URLs from Imgix, which are prepped and optimized for the
 * users's screen size and device resolution.
 *
 * @param  {int} preload Number of images to preload on initialisation.
 * @return {data} The data object passed through the Promise chain.
 */
module.exports = function (preload) {
  var monkeys = this.monkeys;
  var helpers = this.helpers;

  var quality = {
    desktop: 60,
    mobile: 20
  };

  /**
   * Takes data and turns letters into URLs.
   */
  return function (data) {
    var size = monkeys[data.monkeyType].calculateSize(data);
    var dpr = window.devicePixelRatio || 1;

    if (data.spreads === 'single') {
      size /= 2;
    }

    var queryString = 'w=' + size + '&dpr=' + dpr + '&q=' + quality[data.monkeyType];

    // @todo: Is this used?
    data.queryString = '?' + queryString;

    // data.urls is a list of the raw image URLs, not resized or compressed.
    data.urls = $.map(data.letters, function (letterData) {
      // Change the type of letter if we've not got the spread for it, so we
      // can try and add it at a later stage.
      if (letterData.type === 'spread' && !letterData.ready) {
        letterData.type = 'spreadMissing';
        data.needsSpread = true;
      }

      var separator = letterData.url.indexOf('?') === -1 ? '?' : '&';
      return letterData.url + separator + queryString;
    });

    return helpers.preload(data.urls.slice(0, preload))
      .then(function () {
        return data;
      });
  };
};
