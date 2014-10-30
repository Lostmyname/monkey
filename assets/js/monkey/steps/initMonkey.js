'use strict';

module.exports = function () {
  return function (data) {
    if (data.monkeyType === 'mobile') {
      this.monkeys.mobile.init(this, data);
    } else {
      this.monkeys.desktop.init(this, data);
    }

    return data;
  }.bind(this);
};
