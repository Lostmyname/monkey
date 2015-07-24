'use strict';

/**
 * Check to see whether we need to show the language overlay
 *
 * @param {string|HTMLElement|jQuery} monkeyContainer The container.
 */
module.exports = function ($monkeyContainer) {

  return function (data) {
    // A data value is attached to the container rather than to the data object
    // because we don't have access to the data object when we're check whether
    // we have to show the language overlay. @todo This looks as though it could
    // definitely be refactored better, though.
    if ($monkeyContainer.data('show-language-overlay') === true) {
      data.showLanguageOverlay = true;
    } else {
      data.showLanguageOverlay = false;
    }
    return data;
  };
};
