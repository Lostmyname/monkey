'use strict';

var $ = require('jquery');

/**
 * Inserts HTML into specified container.
 *
 * @param {string|HTMLElement|jQuery} monkeyContainer The container.
 */
module.exports = function (monkeyContainer, options) {
  var $container = $(monkeyContainer);

  return function (data) {
    if (!options.replaceMonkey && options.showCharPicker) {
      $container.find('.loader-img').remove();
      $container.next('.lmn-book__label').removeAttr('style');
    }
    $container.append(data.html);

    data.container = $container;

    return data;
  };
};
