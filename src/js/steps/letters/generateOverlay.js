'use strict';

var $ = require('jquery');

/**
 * Generate HTML for letters.
 *
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 */
module.exports = function (options) {
  return function (data) {
    var $overlay = $('<div />');
    var $monkeyContainer = data.monkeyContainer;
    $overlay.appendTo($monkeyContainer)
      .addClass('overlay');

    var $overlayInner = $('<div />')
      .addClass('row');
    $overlayInner.appendTo($overlay);

    var $titleBox = $('<h4 />')
      .text('These look familar!');
    $titleBox.appendTo($overlayInner);

    var $messageBox = $('<div />')
      .text('Some of the characters above appear in both ' + options.firstBookName +
          ' and ' + data.name + '\'s books. But never fear - you can change the ones in yellow. ' +
          'Would you like to?')
      .addClass('col col-lg-8 col-sm-12 col-lg-offset-2');
      $messageBox.appendTo($overlayInner);

    var $buttonContainer = $('<div />')
      .addClass('col lg-mar');

    var $yesButton = $('<button />')
      .text('YES PLEASE!')
      .addClass('button col col-sm-12 primary sm-mar md-mar-t');

    var $noButton = $('<button />')
      .text('No thanks!')
      .addClass('button col col-sm-12 sm-mar md-mar-t');

    $buttonContainer.appendTo($overlayInner);
    $noButton.appendTo($buttonContainer);
    $yesButton.appendTo($buttonContainer);

    $yesButton.on('click', function () {
      data.editCharacters = true;
      closeOverlay();
    });

    $noButton.on('click', function () {
      $('.change-character').remove();
      closeOverlay();
    });

    function closeOverlay () {
      $('.letter').removeClass('changed');
      $overlay.slideUp();
    }
    return data
  }
}
