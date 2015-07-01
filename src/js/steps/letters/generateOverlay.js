'use strict';

var $ = require('jquery');

/**
 * Generate HTML for letters.
 *
 * @param {string|boolean} [selector] Selector or element to insert letters into.
 * @param {object} lang Object containing language stuff.
 */
module.exports = function (options, monkeyContainer) {
  var defer = $.Deferred();
  return function (data) {
    function loadOverlay () {
      var $monkeyContainer = monkeyContainer;
      // $monkeyContainer.css({minHeight: 220});
      var $overlay = $('<div />');
      var $monkeyContainer = data.monkeyContainer;

      $overlay.appendTo($monkeyContainer)
        .addClass('overlay lg-pad lg-pad-on-md sm-pad-on-sm');

      var $overlayInner = $('<div />')
        .addClass('row');
      $overlayInner.appendTo($overlay);

      var $titleBox = $('<h4 />')
        .text('These look familiar!');
      $titleBox.appendTo($overlayInner);

      var $messageBox = $('<div />')
        .text('Some of the letters above appear in both ' + options.book.firstbook +
            ' and ' + data.name + '\'s books. But never fear - we have extra ' +
            'characters for the letters in yellow. ' +
            'Would you like to use these new characters?')
        .addClass('col col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-xs-offset-0');
        $messageBox.appendTo($overlayInner);

      var $buttonContainer = $('<div />')
        .addClass('col lg-pad');

      var $yesButton = $('<button />')
        .text('YES PLEASE!')
        .addClass('button primary col md-mar-t-on-sm sm-mar md-mar-t-on-xs no-mar-on-xs');

      var $noButton = $('<button />')
        .text('No thanks!')
        .addClass('button col md-mar-t-on-sm sm-mar md-mar-t-on-xs no-mar-on-xs');

      $buttonContainer.appendTo($overlayInner);
      $noButton.appendTo($buttonContainer);
      $yesButton.appendTo($buttonContainer, function () {
        defer.resolve();
      });

      $yesButton.on('click', function () {
        data.editCharacters = true;
        closeOverlay();
      });

      $noButton.on('click', function () {
        closeOverlay();
      });

      function closeOverlay () {
        $('.letter').removeClass('changed');
        $monkeyContainer.css({minHeight: 0});
        $overlay.slideUp();

      };
      return defer.promise();
    };
    loadOverlay()
      .then(function () {
        return data;
      })
    return data
  }
}
