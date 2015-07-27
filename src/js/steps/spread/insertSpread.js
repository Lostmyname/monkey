'use strict';
/**
 * Inserts a new spread into the Heidelberg instance.
 *
 * @return {function}
 */
module.exports = function () {
  /**
   * Takes the data object and the URL of the missing spread, and combines the
   * query string to compress/optimize the image, before adding the spread to
   * the Heidelberg.
   * @param  {object} monkeyData The data object passed through the Promise chain
   * @param  {string} spreadUrl  The URL of the new spread image
   * @return {null}
   */
  return function (monkeyData, spreadUrl) {
    spreadUrl += monkeyData.queryString;

    monkeyData.html.find('.page-spreadMissing')
      .removeClass('page-spreadMissing')
      .addClass('page-spread')
      .find('img')
        .attr('src', spreadUrl);
  };
};
