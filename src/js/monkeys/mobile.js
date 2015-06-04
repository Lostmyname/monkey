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
  var windowLeft = 0;
  var maxProgress = 0;

  var $monkey = data.html;
  var RATIO = this.Monkey.IMAGE_RATIO;

  $window.on('orientationchange resize', setWidths);
  setTimeout(setWidths);

  function setWidths() {
    var width = $window.width() * 1.5;
    var height = Math.ceil(width / RATIO);
    var $page = $('.page');

    $('.landscape-images-inner').width(width * ($page.length + 1));

    $page.children('img').css({
      height: height,
      width: Math.ceil(width)
    });

    $('.page-halfwidth')
      .css('width', Math.ceil(width / 2))
      .find('img').css('height', height);

    $monkey.scrollLeft($monkey.find('img').width() * windowLeft);
  }

  $monkey.on('scroll', function () {
    var scrollLeft = $monkey.scrollLeft();
    var index = scrollLeft / $monkey.find('.landscape-images-inner').width();
    if (index > maxProgress) {
      maxProgress = index;
      $events.trigger('bookprogress', {progress: index})
    }

    windowLeft = scrollLeft / $monkey.find('img').width();

    if (scrollLeft / $monkey.find('.landscape-images-inner').width() > 0.5) {
      $events.trigger('halfway');
    }

    if ($monkey.find('.page:last').position().left < $(window).width()) {
      $events.trigger('finished');
    }
  });

  this.harass(data);

  return this.letterHandler(data, $events);
};

mobile.harass = function (data) {
  // Taken from jQuery Easing: http://gsgd.co.uk/sandbox/jquery/easing/
  var easing = 'easeInOutQuad';
  $.easing[easing] = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  };

  data.container.one('mousedown touchstart pointerdown', function () {
    data.html.stop();
  });

  function scroll() {
    data.html.animate({ scrollLeft: 10 }, 800, easing, function () {
      data.html.animate({ scrollLeft: 0 }, 800, easing, scroll);
    });
  }

  scroll();
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
