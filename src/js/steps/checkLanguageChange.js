'use strict';

/**
 * Check to see whether we need to show the language overlay
 *
 * @param {string|HTMLElement|jQuery} monkeyContainer The container.
 */
module.exports = function ($monkeyContainer, options, pickerLocales) {

  // We need to check whether we have to show the language overlay, and we do
  // this by seeing whether the current language is different to the book's
  // language when it was initialized, whether we're switching between locales
  // which have the character picker (currently en-GB and en-US) and therefore
  // don't need the language overlay, and finally, if the book has characters
  // that have been changed before the language change. Phew.
  if (pickerLocales.indexOf(options.book.locale) === -1 &&
      pickerLocales.indexOf($monkeyContainer.data('locale')) !== -1 &&
      $monkeyContainer.data('changedChars')
    ) {
    $monkeyContainer.attr('data-show-picker', '');
    options.showLanguageOverlay = true;
  }
  if ($monkeyContainer.data('locale') !== options.book.locale &&
      pickerLocales.indexOf(options.book.locale) === -1
    ) {
    delete options.book.characterSelection;
    delete options.book.comparisonBooks;
    $monkeyContainer.data('locale', options.book.locale)
  }
  return options
};
