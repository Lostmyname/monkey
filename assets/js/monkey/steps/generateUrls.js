'use strict';

module.exports = function () {
  var monkey = this;

  /**
   * Takes data and turns letters into URLs.
   */
  return function (data) {
    var height = monkey.monkeys[data.monkeyType].calculateHeight(data);
    var dpr = window.devicePixelRatio || 1;
    var quality = (data.monkeyType === 'desktop') ? 60 : 20;

    var queryString = '?h=' + height + '&dpr=' + dpr + '&q=' + quality;
    data.queryString = queryString;

    data.bookTipTap += queryString;
    data.bookTipSwipe += queryString;

    data.urls = $.map(data.letters, function (letterData) {
      if (letterData.type === 'spread' && !letterData.ready) {
        letterData.type = 'spreadMissing';
        data.needsSpread = true;
      }

      return letterData.url + queryString;
    });

    return data;
  };
};
