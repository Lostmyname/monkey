'use strict';

module.exports = function () {
  return function (monkeyData, spreadUrl) {
    spreadUrl += monkeyData.queryString;

    monkeyData.html.find('.page-spreadMissing')
      .removeClass('page-spreadMissing')
      .addClass('page-spread')
      .find('img')
        .attr('src', spreadUrl);
  };
};
