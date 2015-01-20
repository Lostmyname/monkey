'use strict';

require('browsernizr/test/css/transformstylepreserve3d');
require('browsernizr/test/css/transforms3d');
window.Modernizr = require('browsernizr');
var Heidelberg = require('heidelberg');
var nums = require('nums');

var desktop = module.exports = {};

desktop.calculateSize = function () {
  return 'w=' + Math.min($(window).width(), 1280);
};

desktop.generateHtml = function (data) {
  var $monkey = $('<div />').addClass('Heidelberg-Book with-Spreads desktop');

  $.each(data.urls, function (i, url) {
    var $page = $('<div />').appendTo($monkey)
      .addClass('Heidelberg-Spread page-' + data.letters[i].type);

    if (i === data.urls.length - 1) {
      $('<div />').appendTo($page)
        .addClass('last-page')
        .append($('<img />').attr('src', data.lastPage));
    }

    $('<img />').appendTo($page).attr('src', url);
  });

  return $monkey;
};

desktop.init = function (data, $events) {
  data.heidelberg = new Heidelberg(data.html, {
    arrowKeys: false,
    hasSpreads: true
  });

  data.heidelberg.el.addClass('at-front-cover');

  $(data.heidelberg).on('pageTurn.heidelberg', function (e, $el, els) {
    $events.trigger('pageTurn');

    var index = els.pages.index(els.pagesTarget);

    $el.toggleClass('at-front-cover', !index);

    if (index / els.pages.length > 0.5) {
      $events.trigger('halfway');
    }

    if (index === els.pages.length - 2) {
      $events.trigger('finished');
    }
  });

  return this.letterHandler(data, $events);
};

desktop.letterHandler = function (data, $events) {
  var fireEvent = true;
  var lastIndex = 0;

  $(data.heidelberg).on('pageTurn.heidelberg', function (e, el, els) {
    if (fireEvent) {
      var index = (els.pagesTarget.index() - 1) / 2;
      $events.trigger('letterChange', index);
      lastIndex = (els.pagesTarget.index() - 3) / 4;
    }
  });

  // Do it on the next free cycle to ensure the event has been added
  setTimeout(function () {
    $events.trigger('letterChange', 0);
  });

  return function turnToPage(index) {
    fireEvent = false;

    // If already on the page, flip to the other page in the pair
    if (index === lastIndex) {
      index += index % 1 ? -0.5 : 0.5;
    }

    var indexes = nums(lastIndex * 4 + 4, index * 4 + 4);
    var doubleSpeed = (indexes.length > 10);

    // If index ends .5, doubleSpeed doesn't work. Tbh I'm not sure why.
    // @todo: Think of a proper fix
    if (index % 1 !== 0) {
      doubleSpeed = false;
    }

    var time = (doubleSpeed ? 15 : 30);

    // This ensures that the event is only fired for the last page turn
    setTimeout(function () {
      fireEvent = true;
    }, (indexes.length - 1) * time);

    $.each(indexes, function (i, index) {
      // Happen only every 2 or 4 times
      if (index % (doubleSpeed ? 4 : 2)) {
        return;
      }

      setTimeout(function () {
        data.heidelberg.turnPage(index - 1);
      }, i * time);
    });
  };
};
