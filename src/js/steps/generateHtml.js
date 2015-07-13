'use strict';

/**
 * Generate HTML for pages from list of URLs.
 *
 * Varies depending on the browser.
 *
 * @todo: Templating?
 */
module.exports = function (lang) {
  return function (data) {
    data.html = this.monkeys[data.monkeyType].generateHtml(data, lang);

    return data;
  }.bind(this);
};
