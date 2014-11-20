'use strict';

var lastReplacements = null;

/**
 * Templating sort of? Takes a string and an object and makes replacements.
 *
 * If replacements is {foo: 'bar'}, `{{ foo }}` will be replaced with `bar`.
 *
 * @param {string} string String to do replacements on.
 * @param {object} [replacements] Object of replacements. If ommitted, will use
 *                                object from last time.
 * @returns {string} The string with replacements made.
 */
module.exports = function (string, replacements) {
  if (typeof replacements !== 'object') {
    replacements = lastReplacements;
  } else {
    lastReplacements = replacements;
  }

  return string.replace(/\{\{\s*([a-z]+)\s*\}\}/g, function (full, item) {
    return replacements.hasOwnProperty(item) ? replacements[item] : full;
  });
};
