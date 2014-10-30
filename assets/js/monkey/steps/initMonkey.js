'use strict';

var mobile = require('../monkeys/mobile');

module.exports = function () {
  return function (data) {
    if (data.monkeyType === 'mobile') {
      mobile.init(data.html);
    }

    return data;
  };
};
