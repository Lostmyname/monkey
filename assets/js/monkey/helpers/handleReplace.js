'use strict';

/**
 * Templating sort of? Takes a string and an object and makes replacements.
 *
 * IF replacements is {foo: 'bar'}, `{{ foo }}` will be replaced with `bar`.
 *
 * @param {string} string
 * @param {object} replacements
 * @returns {string} The string with replacements made.
 */
module.exports = function (string, replacements) {
  return string.replace(/\{\{\s*([a-z]+)\s*\}\}/g, function (full, item) {
    return replacements.hasOwnProperty(item) ? replacements[item] : full;
  });
};
