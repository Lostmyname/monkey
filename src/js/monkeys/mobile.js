'use strict';

var $ = require('jquery');

var mobile = module.exports = {};
var $window = $(window);

mobile.calculateSize = function () {
  var height = Math.min($window.width(), $window.height());

  // Max height = iPad three
  var MAX_HEIGHT = 768;
  return 'h=' + Math.min(MAX_HEIGHT, Math.ceil(height));
};

mobile.generateHtml = function (data) {
  var $monkey = $('<div />').addClass('monkey mobile');
  var $images = $('<div />').appendTo($monkey)
    .addClass('landscape-images');
  var $inner = $('<div />').appendTo($images)
    .addClass('landscape-images-inner');

  $.each(data.urls, function (i, url) {
    var $page = $('<div />').appendTo($inner)
      .addClass('page page-' + data.letters[i].type);

    if (i === 0) {
      $page.addClass('page-first page-halfwidth');
    }

    if (i === data.urls.length - 1) {
      $page.addClass('page-halfwidth');
    }

    $('<img />').appendTo($page).attr('src', url);
  });

  return $monkey;
};

mobile.init = function (data, $events) {
  var portrait;
  var windowLeft = 0;

  var $monkey = data.html;
  var RATIO = this.Monkey.IMAGE_RATIO;

  $window.on('orientationchange resize', flip);
  setTimeout(flip);

  function flip() {
    // @todo: Refactor this out properly. It's not used anymore.
    portrait = true;

    if ($monkey.hasClass(portrait ? 'portrait' : 'landscape')) {
      $events.trigger('rotate');
    }

    var width = portrait ? $window.width() * 1.5 : $window.height() * RATIO;
    var height = Math.ceil(width / RATIO);

    $('.landscape-images-inner').width(width * ($('.page').length + 1));

    $('.page > img').css({
      height: height,
      width: Math.ceil(width)
    });

    $('.page-halfwidth')
      .css('width', Math.ceil(width / 2))
      .find('img').css('height', height);

    $('.monkey, body')
      .removeClass('landscape portrait')
      .addClass(portrait ? 'portrait' : 'landscape');

    $monkey.scrollLeft($monkey.find('img').width() * windowLeft);
  }

  $monkey.on('scroll', function () {
    var scrollLeft = $monkey.scrollLeft();

    windowLeft = scrollLeft / $monkey.find('img').width();

    if (scrollLeft / $monkey.find('.landscape-images-inner').width() > 0.5) {
      $events.trigger('halfway');
    }

    if ($monkey.find('.page:last').position().left < $(window).width()) {
      $events.trigger('finished');
    }
  });

  // HORRIBLE HACK FOR A HORRIBLE FIX FOR A HORRIBLE BUG
  setTimeout(function () {
    $monkey.one('scroll', function () {
      var $inner = $('.landscape-images-inner');

      // Forces a rerender, which gets rid of a random gap at the end
      $inner.css('width', parseInt($inner.css('width'), 10) + 1);
    });
  }, 5);

  return this.letterHandler(data, $events);
};

mobile.letterHandler = function (data, $events) {
  var $monkey = data.html;
  var $pages = $monkey.find('.page');

  var page = -1;

  $monkey.on('scroll', function () {
    var currentPage = 0;

    $pages.each(function (i) {
      if ($(this).offset().left >= -$window.width()) {
        currentPage = i;

        return false;
      }
    });

    if (currentPage !== page) {
      page = currentPage;
      $events.trigger('letterChange', page);
    }
  });

  // Do it on the next free cycle to ensure the event has been added
  setTimeout(function () {
    $monkey.triggerHandler('scroll');
  });

  // index is the letter index
  return function turnToPage(index) {
    var $page = $pages.eq(index * 2 + 1);
    var offset = $page.offset().left - $page.parent().offset().left;

    $monkey.scrollLeft(offset);
  };
};
