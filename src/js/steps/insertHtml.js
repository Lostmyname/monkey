'use strict';

var $ = require('jquery');

/**
 * Inserts HTML into specified container. More specifically, it appends the
 * Heidelberg instance into the container element (usually .lmn-book).
 *
 * @param {string|HTMLElement|jQuery} monkeyContainer The container.
 */
module.exports = function (monkeyContainer) {
  var $container = $(monkeyContainer);

  return function (data) {
    /**
     * We want to remove the loading gif here, and then show the 'Tap to
     * Preview' label. We do this because it's nonsensical to have the label
     * appear when there's nothing to tap.
     */
    $container.find('.loader-img').remove();
    $container.next('.lmn-book__label').addClass('js--show-label');
    $container.next('.lmn-book__label').removeAttr('style');

    // Append the Heidelberg to the container, and attach the container to the
    // data attribute that's passed through the Promise chain.
    $container.append(data.html);
    data.container = $container;

    return data;
  };
};
