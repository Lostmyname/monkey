'use strict';

/**
 * Returns the number of characters that can be centered on the screen on
 * mobile devices, respective to the mobile window width.
 *
 * @returns {integer} Number of characters, defaults to 5..
 */
module.exports = function () {
  var windowWidth = window.innerWidth ||
                    document.documentElement.clientWidth ||
                    document.body.clientWidth;
  // We start with a 5 character minimum, then for every 50px after 420px window
  // width, we add a character.
  var numOfChars = 5;
  if(window.innerWidth >= 420) {
    numOfChars = Math.round(parseFloat(((windowWidth - 420) / 50) + 5));
  }
  return numOfChars;
};
