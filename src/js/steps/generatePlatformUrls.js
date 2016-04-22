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
  //var monkeys = this.monkeys;
  var helpers = this.helpers;

  // var quality = {
  //   desktop: 60,
  //   mobile: 20
  // };

  /**
   * Takes data and turns letters into URLs.
   */
  return function (data) {
    // var width;
    // var size = options.imageWidth || monkeys[data.monkeyType].calculateSize(data);

    // data.urls is a list of the raw image URLs, not resized or compressed.
    data.urls = $.map(data.letters, function (letterData) {
      return 'http://prod1.platform.lostmy.name' + letterData.url;
    });

    return helpers.preload(data.urls.slice(0, options.preload))
      .then(function () {
        return data;
      });
  };
};
