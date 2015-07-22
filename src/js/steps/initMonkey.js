'use strict';

module.exports = function ($events, options) {
  return function (data) {
    data.turnToPage = this.monkeys[data.monkeyType].init(data, $events, options);

    return data;
  }.bind(this);
};
