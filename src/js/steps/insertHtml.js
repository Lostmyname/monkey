'use strict';

/**
 * Inserts HTML into specified container.
 *
 * @param {string|HTMLElement|jQuery} monkeyContainer The container.
 */
module.exports = function (monkeyContainer) {
  var $container = $(monkeyContainer);

  return function (data) {
    $container.empty().append(data.html);

    data.container = $container;

    return data;
  };
};