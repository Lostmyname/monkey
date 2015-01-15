'use strict';

/**
 * Decide whether future stuff should be desktop or mobile.
 *
 * @param {string} monkeyType Either "auto", "mobile" or "desktop". Defaults
 * to auto and will calculate whether mobile or desktop is better.
 */
module.exports = function (monkeyType) {
  var isMobile = this.helpers.isMobile;

  return function (data) {
    if (typeof monkeyType === 'undefined' || monkeyType === 'auto') {
      data.monkeyType = isMobile() ? 'mobile' : 'desktop';
    } else {
      data.monkeyType = monkeyType;
    }
    return data;
  };
};
