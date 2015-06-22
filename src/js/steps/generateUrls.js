'use strict';

var $ = require('jquery');

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

    var queryString = size + '&dpr=' + dpr + '&q=' + quality[data.monkeyType];

    // @todo: Is this used?
    data.queryString = '?' + queryString;

    data.urls = $.map(data.letters, function (letterData) {
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
