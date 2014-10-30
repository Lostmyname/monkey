'use strict';

module.exports = function () {
  return function (data) {
    if (data.monkeyType === 'mobile') {
      this.monkeys.mobile.init(data.html);
    }

    return data;
  }.bind(this);
};
