'use strict';

module.exports = function (monkey) {
  /**
   * Generate HTML for pages from list of URLs.
   *
   * Varies depending on the browser.
   *
   * @todo: Templating?
   */
  return function () {
    if (monkey.helpers.isMobile()) {
      return require('./generateHtml-mobile')(monkey);
    } else {
      return require('./generateHtml-desktop')(monkey);
    }
  };
};
