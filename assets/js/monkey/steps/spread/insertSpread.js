'use strict';

module.exports = function () {
  return function ($monkey, monkeyData) {
    $monkey.find('.page-spreadMissing')
      .removeClass('page-spreadMissing')
      .addClass('page-spread')
      .find('img')
        .attr('src', monkeyData.actualSpreadUrl);
  };
};
