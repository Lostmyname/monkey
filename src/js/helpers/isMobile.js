'use strict';

/**
 * Returns whether browser is a mobile or not. Tests for touch support and
 * screen width.
 *
 * @returns {boolean} True if mobile.
 */
module.exports = function () {
  // If doesn't support touch
  if (!('ontouchstart' in window) && !navigator.msMaxTouchPoints) {
    return false;
  }

  if (!window.matchMedia) {
    return false;
  }

  return window.matchMedia('(max-width: 770px)').matches;
};
