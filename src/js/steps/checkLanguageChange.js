'use strict';

/**
 * Check to see whether we need to show the language overlay
 *
 * @param {string|HTMLElement|jQuery} monkeyContainer The container.
 */
module.exports = function ($monkeyContainer) {

  return function (data) {
    if ($monkeyContainer.data('show-language-overlay') === true) {
      data.showLanguageOverlay = true;
    } else {
      data.showLanguageOverlay = false;
    }
    return data;
  };
};
