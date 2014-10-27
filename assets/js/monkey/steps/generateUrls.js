'use strict';

module.exports = function (monkey) {
  /**
   * Takes data and turns letters into URLs.
   */
  return function () {
    return function (data) {
      data.urls = $.map(data.letters, function (letterData) {
        var url = {
          special: monkey._urls.images,
          story: monkey._urls.images,
          spread: monkey._urls.spread
        }[letterData.type];

        return monkey.helpers.handleReplace(url, {
          gender: data.gender,
          locale: data.locale,
          name: data.name,
          url: letterData.url
        });
      });

      return data;
    };
  };
};
