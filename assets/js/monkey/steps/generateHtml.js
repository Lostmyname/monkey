'use strict';

/**
 * Generate HTML for pages from list of URLs.
 *
 * Varies depending on the browser.
 *
 * @todo: Templating?
 */
module.exports = function () {
  if (this.helpers.isMobile()) {
    return require('./generateHtml-mobile')(this);
  } else {
    return require('./generateHtml-desktop')(this);
  }
};
