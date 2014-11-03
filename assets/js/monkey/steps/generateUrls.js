'use strict';

module.exports = function () {
  var monkey = this;

  var typeUrls = {
    special: monkey._urls.images,
    story: monkey._urls.images,
    spread: monkey._urls.spread
  };

  /**
   * Takes data and turns letters into URLs.
   *
   * @todo: Request correct size on desktop
   */
  return function (data) {
    var $window = $(window);
    var height = Math.min($window.width(), $window.height());

    // iPad three
    if (height > 768) {
      height = 768;
    }

    data.urls = $.map(data.letters, function (letterData) {
      var url = typeUrls[letterData.type];

      return monkey.helpers.handleReplace(url, {
        gender: data.gender,
        locale: data.locale,
        name: data.name,
        url: letterData.url,
        height: height,
        dpr: window.devicePixelRatio || 1
      });
    });

    return data;
  };
};
