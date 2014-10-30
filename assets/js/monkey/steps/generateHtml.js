'use strict';

/**
 * Generate HTML for pages from list of URLs.
 *
 * Varies depending on the browser.
 *
 * @todo: Templating?
 */
module.exports = function () {
  return function (data) {
    if (data.monkeyType === 'mobile') {
      require('./generateHtml-mobile')(this, data);
    } else {
      require('./generateHtml-desktop')(this, data);
    }

    return data;
  };
};
