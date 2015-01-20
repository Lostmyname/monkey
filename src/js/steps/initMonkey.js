'use strict';

module.exports = function ($events) {
  return function (data) {
    data.turnToPage = this.monkeys[data.monkeyType].init(data, $events);

    return data;
  }.bind(this);
};
