'use strict';

/**
 * Decide whether future stuff should be desktop or mobile.
 */
module.exports = function () {
  return function (data) {
    data.monkeyType = this.helpers.isMobile() ? 'mobile' : 'desktop';
    return data;
  };
};
