'use strict';

module.exports = function () {
  return function (monkey, monkeyData) {
    monkeyData.html.find('.page-spreadMissing')
      .removeClass('page-spreadMissing')
      .addClass('page-spread')
      .find('img')
        .attr('src', monkey.helpers.handleReplace(monkey._urls.spread));
  };
};
