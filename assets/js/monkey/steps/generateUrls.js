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
   *
   * @todo: Request correct size on desktop
   */
  return function (data) {
    var $window = $(window);
    var height = Math.min($window.width(), $window.height());
    var handleReplace = monkey.helpers.handleReplace;

    // iPad three
    if (height > 768) {
      height = 768;
    }

    var replacements = {
      gender: data.gender,
      locale: data.locale,
      name: data.name,
      height: height,
      dpr: window.devicePixelRatio || 1
    };

    // @todo: Make a helper and do this somewhere else
    data.tipUrl = handleReplace(monkey._urls.bookTipTap, replacements);
    console.log(data.tipUrl);

    data.urls = $.map(data.letters, function (letterData) {
      replacements.url = letterData.url;

      if (letterData.type === 'spread' && !letterData.ready) {
        letterData.type = 'spreadMissing';
        data.needsSpread = true;

        data.actualSpreadUrl = handleReplace(typeUrls.spread, replacements);
      }

      return handleReplace(typeUrls[letterData.type], replacements);
    });

    return data;
  };
};
