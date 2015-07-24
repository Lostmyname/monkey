'use strict';

/**
 * Generate base HTML element for all of monkey.
 *
 * Varies depending on the browser.
 *
 */
module.exports = function (monkeyContainer, options) {
  return function (data) {
    // Attach a cloned version of the loading gif to the data object, so we can
    // use it later.
    data.loading = monkeyContainer.find('.loader-img').clone();
    // Remove all DOM elements within the container (needed for
    // re-initialisation when changing name in the edit screen)
    monkeyContainer.empty();

    // If replaceMonkey is true (which means a user has changed the name/gender/
    // language of a book on the product page) then append the loading gif to
    // the container – so the user has visible feedback that something is
    // loading in.
    if (options.replaceMonkey) {
      data.loading = data.loading.appendTo(monkeyContainer);
    }
    // Add either a desktop/mobile CSS class to the container, and attach the
    // container element to the data object. Not sure why we're declaring it
    // twice, @todo to investigate and fix that.
    monkeyContainer.addClass(data.monkeyType);
    data.base = monkeyContainer;
    data.monkeyContainer = monkeyContainer;

    return data;
  };
};

