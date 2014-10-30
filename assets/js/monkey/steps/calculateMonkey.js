'use strict';

/**
 * Decide whether future stuff should be desktop or mobile.
 */
module.exports = function () {
  var isMobile = this.helpers.isMobile;

  return function (data) {
    data.monkeyType = isMobile() ? 'mobile' : 'desktop';
    return data;
  };
};
