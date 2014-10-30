'use strict';

module.exports = function () {
  return function (data) {
    this.monkeys[data.monkeyType].init(this, data);

    return data;
  }.bind(this);
};
