'use strict';

module.exports = function (preload) {
  var monkeys = this.monkeys;
  var helpers = this.helpers;

  /**
   * Takes data and turns letters into URLs.
   */
  return function (data) {
    var size = monkeys[data.monkeyType].calculateSize(data);
    var dpr = window.devicePixelRatio || 1;
    var quality = (data.monkeyType === 'desktop') ? 60 : 20;

    var queryString = '?' + size + '&dpr=' + dpr + '&q=' + quality;
    data.queryString = queryString;

    data.bookTipTap += queryString;
    data.bookTipSwipe += queryString;
    data.lastPage += queryString;

    data.urls = $.map(data.letters, function (letterData) {
      if (letterData.type === 'spread' && !letterData.ready) {
        letterData.type = 'spreadMissing';
        data.needsSpread = true;
      }

      return letterData.url + queryString;
    });

    var urls = data.urls.slice(0, preload);

    var image = (data.monkeyType === 'mobile') ? 'bookTipSwipe' : 'bookTipTap';
    urls.unshift(data[image]);

    return helpers.preload(urls)
      .then(function () {
        return data;
      });
  };
};
