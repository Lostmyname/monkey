'use strict';

require('browsernizr/test/css/transformstylepreserve3d');
require('browsernizr/test/css/transforms3d');
window.Modernizr = require('browsernizr');
var Heidelberg = require('heidelberg');

var desktop = module.exports = {};

desktop.calculateSize = function () {
  return 'w=' + Math.min($(window).width(), 1000);
};

desktop.generateHtml = function (data) {
  var $monkey = $('<div />').addClass('Heidelberg-Book with-Spreads desktop');

  $.each(data.urls, function (i, url) {
    var $page = $('<div />').appendTo($monkey)
      .addClass('Heidelberg-Spread page-' + data.letters[i].type);

    if (i === 0) {
      $('<div />').appendTo($page)
        .addClass('heidelberg-tapToOpen')
        .append($('<img />').attr('src', data.bookTipTap));
    }

    if (i === data.urls.length - 1) {
      $('<div />').appendTo($page)
        .addClass('last-page')
        .append($('<img />').attr('src', data.lastPage));
    }

    $('<img />').appendTo($page).attr('src', url);
  });

  return $monkey;
};

desktop.init = function (data) {
  data.heidelberg = new Heidelberg(data.html, {
    arrowKeys: false,
    hasSpreads: true
  });
};

desktop.letterHandler = function (data) {
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
