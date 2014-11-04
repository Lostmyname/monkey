'use strict';

module.exports = function () {
  var monkey = this;

  var typeUrls = {
    special: monkey._urls.images,
    story: monkey._urls.images,
    spread: monkey._urls.spread,
    spreadMissing: monkey._urls.spreadMissing
  };

  /**
   * Takes data and turns letters into URLs.
   */
  return function (data) {
    var handleReplace = monkey.helpers.handleReplace;
    var height = monkey.monkeys[data.monkeyType].calculateHeight(data);

    var replacements = {
      gender: data.gender,
      locale: data.locale,
      name: data.name,
      height: height,
      dpr: window.devicePixelRatio || 1
    };

    data.urls = $.map(data.letters, function (letterData) {
      replacements.url = letterData.url;

      if (letterData.type === 'spread' && !letterData.ready) {
        letterData.type = 'spreadMissing';
        data.needsSpread = true;
      }

      return handleReplace(typeUrls[letterData.type], replacements);
    });

    return data;
  };
};
