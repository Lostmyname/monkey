'use strict';

module.exports = function () {
  /**
   * Inserts HTML into specified container.
   *
   * @param {string|HTMLElement|jQuery} monkeyContainer The container.
   */
  return function (monkeyContainer) {
    var $container = $(monkeyContainer);

    return function (data) {
      $container.append(data.html);

      data.container = $container;

      return data;
    };
  };
};
