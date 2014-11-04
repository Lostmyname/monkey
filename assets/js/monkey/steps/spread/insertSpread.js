'use strict';

module.exports = function () {
  var monkey = this.monkey;

  return function (monkeyData) {
    monkeyData.html.find('.page-spreadMissing')
      .removeClass('page-spreadMissing')
      .addClass('page-spread')
      .find('img')
        .attr('src', monkey.helpers.handleReplace(monkey._urls.spread));
  };
};
