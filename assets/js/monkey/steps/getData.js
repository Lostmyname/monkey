'use strict';

/**
 * Gets the data from the server (or fakes it, for now).
 *
 * This comment definitely won't be wrong one day. I'll definitely remember
 * to update it.
 *
 * @returns {object} (via promise) Object with a number of properties such as
 *                   name and gender, and then a letters property containing
 *                   information on the pages. Seriously, just use a debugger.
 */
module.exports = function () {
  var defer = $.Deferred();

  setTimeout(function () {
    defer.resolve({
      name: 'HEIDELBERG',
      gender: 'girl',
      locale: 'en-GB',
      letters: [
        { type: 'special', url: 'Front.jpg' },
        { type: 'special', url: 'Intro_01.jpg' },
        { type: 'special', url: 'Intro_02.jpg' },
        { type: 'story', letter: 'H', part: 1, url: 'primary/Hippo_01.jpg' },
        { type: 'story', letter: 'H', part: 2, url: 'primary/Hippo_02.jpg' },
        { type: 'story', letter: 'E', part: 1, url: 'primary/Elephant_01.jpg' },
        { type: 'story', letter: 'E', part: 2, url: 'primary/Elephant_02.jpg' },
        { type: 'story', letter: 'I', part: 1, url: 'primary/Inuit_01.jpg' },
        { type: 'story', letter: 'I', part: 2, url: 'primary/Inuit_02.jpg' },
        { type: 'story', letter: 'D', part: 1, url: 'primary/Dragon_01.jpg' },
        { type: 'story', letter: 'D', part: 2, url: 'primary/Dragon_02.jpg' },
        { type: 'story', letter: 'E', part: 1, url: 'primary/Eagle_01.jpg' },
        { type: 'story', letter: 'E', part: 2, url: 'primary/Eagle_02.jpg' },
        { type: 'story', letter: 'L', part: 1, url: 'primary/Lion_01.jpg' },
        { type: 'story', letter: 'L', part: 2, url: 'primary/Lion_02.jpg' },
        { type: 'story', letter: 'B', part: 1, url: 'primary/Bear_01.jpg' },
        { type: 'story', letter: 'B', part: 2, url: 'primary/Bear_02.jpg' },
        { type: 'story', letter: 'E', part: 1, url: 'helpers/Helper_Hole_01.jpg' },
        { type: 'story', letter: 'E', part: 2, url: 'helpers/Helper_Hole_E.jpg' },
        { type: 'story', letter: 'R', part: 1, url: 'primary/Robot_01.jpg' },
        { type: 'story', letter: 'R', part: 2, url: 'primary/Robot_02.jpg' },
        { type: 'story', letter: 'G', part: 1, url: 'primary/Giant_01.jpg' },
        { type: 'story', letter: 'G', part: 2, url: 'primary/Giant_02.jpg' },
        { type: 'special', url: 'Outro_01.jpg' },
        { type: 'spread', ready: false },
        { type: 'special', url: 'Back.jpg' }
      ]
    });
  }, 10);

  return defer.promise();
};
