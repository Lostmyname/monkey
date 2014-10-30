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
      data.html = this.monkeys.mobile.generateHtml(this, data);
    } else {
      data.html = this.monkeys.desktop.generateHtml(this, data);
    }

    return data;
  }.bind(this);
};
