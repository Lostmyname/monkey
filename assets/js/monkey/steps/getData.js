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
      bookTipTap: '//lmn-assets.imgix.net/widget/en-GB/v2/images/book_tip.png',
      bookTipSwipe: 'assets/images/book-swipe.png',
      letters: [
        { type: 'special', url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/extras/Front.jpg' },
        { type: 'special', url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/extras/Intro_s_Page_1.jpg' },
        { type: 'special', url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/extras/Intro_s_Page_2.jpg' },
        { type: 'story', letter: 'H', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/H_Hippo_s_Page_1.jpg' },
        { type: 'story', letter: 'H', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/H_Hippo_s_Page_2.jpg' },
        { type: 'story', letter: 'E', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/E_Elephant_s_Page_1.jpg' },
        { type: 'story', letter: 'E', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/E_Elephant_s_Page_2.jpg' },
        { type: 'story', letter: 'I', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/I_Imp_s_Page_1.jpg' },
        { type: 'story', letter: 'I', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/I_Imp_s_Page_2.jpg' },
        { type: 'story', letter: 'D', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/D_Dragon_s_Page_1.jpg' },
        { type: 'story', letter: 'D', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/D_Dragon_s_Page_2.jpg' },
        { type: 'story', letter: 'E', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/E_Eagle_s_Page_1.jpg' },
        { type: 'story', letter: 'E', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/E_Eagle_s_Page_2.jpg' },
        { type: 'story', letter: 'L', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/L_Lion_s_Page_1.jpg' },
        { type: 'story', letter: 'L', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/L_Lion_s_Page_2.jpg' },
        { type: 'story', letter: 'B', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/B_Bear_s_Page_1.jpg' },
        { type: 'story', letter: 'B', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/B_Bear_s_Page_2.jpg' },
        { type: 'story', letter: 'E', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/helpers/Helper_Hole_s_Page_1.jpg' },
        { type: 'story', letter: 'E', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/helpers/Helper_Hole_s_E.jpg' },
        { type: 'story', letter: 'R', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/R_Robot_s_Page_1.jpg' },
        { type: 'story', letter: 'R', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/R_Robot_s_Page_2.jpg' },
        { type: 'story', letter: 'G', part: 1, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/G_Giant_s_Page_1.jpg' },
        { type: 'story', letter: 'G', part: 2, url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/G_Giant_s_Page_2.jpg' },
        { type: 'special', url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/extras/Outro_s_Page_1.jpg' },
        { type: 'spread', url: '//lmn-assets.imgix.net/widget/en-GB/v2/images/just_rendering.jpg', ready: false },
        { type: 'special', url: '//lmn-assets.imgix.net/widget/en-GB/v2/girl/extras/Back.jpg' }
      ]
    });
  }, 10);

  return defer.promise();
};
