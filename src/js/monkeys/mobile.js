'use strict';

var $ = require('jquery');

var mobile = module.exports = {};

mobile.calculateSize = function () {
  var $window = $(window);
  var height = Math.min($window.width(), $window.height());

  // Max height = iPad three
  return 'h=' + Math.min(768, Math.ceil(height));
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
      $('<div />').appendTo($page)
        .addClass('heidelberg-tapToOpen')
        .append($('<img />').attr('src', data.bookTipSwipe));
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

mobile.init = function (data, $events) {
  var portrait;
  var windowLeft = 0;

  var $monkey = data.html;
  var RATIO = this.Monkey.IMAGE_RATIO;

  $(window).on('orientationchange resize', flip);
  setTimeout(flip);

  function flip() {
    portrait = (window.innerHeight > window.innerWidth);

    if ($monkey.hasClass('landscape') && portrait ||
        $monkey.hasClass('portrait') && !portrait) {
      $events.trigger('rotate');
    }

    var width = portrait ? window.innerWidth * 1.5 : window.innerHeight * RATIO;
    var height = Math.ceil(width / RATIO);

    $('.page > img').css({
      height: height,
      width: Math.ceil(width)
    });

    $('.page .heidelberg-tapToOpen').css('width', Math.ceil(width / 2))
      .find('img').css('height', height);

    $('.monkey, body').removeClass('landscape portrait')
      .addClass(portrait ? 'portrait' : 'landscape');

    $monkey.scrollLeft($monkey.find('img').width() * windowLeft);
  }

  $monkey.on('scroll', function () {
    var scrollLeft = $monkey.scrollLeft();

    windowLeft = scrollLeft / $monkey.find('img').width();

    if (scrollLeft / $monkey.children().width() > 0.5) {
      $events.trigger('halfway');
    }

    if (scrollLeft > $monkey.find('.last-page').parents().position().left) {
      $events.trigger('finished');
    }
  });

  return this.letterHandler(data, $events);
};

mobile.letterHandler = function (data, $events) {
  var $monkey = data.html;
  var $pages = $monkey.find('.page');

  var page = -1;

  $monkey.on('scroll', function () {
    var currentPage = 0;

    $pages.each(function (i) {
      if ($(this).offset().left >= -$(window).width()) {
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
    var pageIndex = index * 2 + 1;
    var offset = $pages.eq(pageIndex).position().left;

    $monkey.scrollLeft(offset);
  };
};
