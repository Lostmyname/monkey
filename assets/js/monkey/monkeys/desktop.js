/* global Heidelberg */

'use strict';

var desktop = module.exports = {};

desktop.calculateHeight = function (monkey) {
  return Math.min(Math.ceil($(window).width() / monkey.IMAGE_RATIO), 1280);
};

desktop.generateHtml = function (monkey, data) {
  var $monkey = $('<div />').addClass('Heidelberg-Book with-Spreads desktop');

  $.each(data.urls, function (i, url) {
    var $page = $('<div />').appendTo($monkey)
      .addClass('Heidelberg-Spread page-' + data.letters[i].type);

    if (i === 0) {
      var tipUrl = monkey.helpers.handleReplace(monkey._urls.bookTipTap);

      $('<div />').appendTo($page)
        .addClass('heidelberg-tapToOpen')
        .append($('<img />').attr('src', tipUrl));
    }

    $('<img />').appendTo($page).attr('src', url);
  });

  return $monkey;
};

desktop.init = function (monkey, data) {
  data.heidelberg = new Heidelberg(data.html, {
    hasSpreads: true
  });
};

desktop.letterHandler = function (monkey, data) {
  var handler = {};

  $(data.heidelberg).on('pageTurn.heidelberg', function (e, el, els) {
    var index = (els.pagesTarget.index() - 1) / 2;
    $(handler).trigger('letterChange', index);
  });

  // Do it on the next free cycle to ensure the event has been added
  setTimeout(function () {
    $(handler).trigger('letterChange', 0);
  });

  return handler;
};
