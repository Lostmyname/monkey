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
    // Runs the generateHtml method, using data.monkeyType to determine whether
    // it should be desktop or mobile initialisation. This adds the Monkey
    // instance to the page, within the predefined container element.
    data.html = this.monkeys[data.monkeyType].generateHtml(data, lang);

    return data;
  }.bind(this);
};
