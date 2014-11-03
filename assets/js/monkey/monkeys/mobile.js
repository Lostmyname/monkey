'use strict';

var mobile = module.exports = {};

mobile.generateHtml = function (monkey, data) {
  var $monkey = $('<div />').addClass('monkey mobile');
  var $images = $('<div />').appendTo($monkey)
    .addClass('landscape-images');
  var $inner = $('<div />').appendTo($images)
    .addClass('landscape-images-inner');

  $.each(data.urls, function (i, url) {
    var $page = $('<div />').appendTo($inner).addClass('page');

    if (i === 0) {
      $('<div />').appendTo($page)
        .addClass('heidelberg-tapToOpen')
        .append($('<img />').attr('src', monkey._urls.bookTipSwipe));
    }

    $('<img />').appendTo($page).attr('src', url);
  });

  return $monkey;
};

mobile.init = function (monkey, data) {
  var portrait;
  var windowLeft = 0;

  var $monkey = data.html;

  $(window).on('orientationchange resize', flip);
  setTimeout(flip);

  function flip() {
    portrait = (window.innerHeight > window.innerWidth);

    var ratio = monkey.IMAGE_RATIO;
    var width = portrait ? window.innerWidth * 1.5 : window.innerHeight * ratio;

    $('.page img').css({
      height: width / monkey.IMAGE_RATIO,
      width: width
    });

    $('.monkey, body').removeClass('landscape portrait')
      .addClass(portrait ? 'portrait' : 'landscape');

    $monkey.scrollLeft($monkey.find('img').width() * windowLeft);
  }

  $monkey.on('scroll', function () {
    windowLeft = $monkey.scrollLeft() / $monkey.find('img').width();
  });
};

mobile.letterHandler = function (monkey, data) {
  var handler = {};
  var $monkey = data.html;

  var page = -1;

  $monkey.on('scroll', function () {
    var $pages = $monkey.find('.page');
    var pages = $pages.length / 2 - 2;
    var currentPage = 0;

    $pages.each(function (i) {
      var $this = $(this);

      if ($this.offset().left >= -$(window).width()) {
        currentPage = Math.floor((i - 1) / 2);
        if (currentPage < 0) {
          currentPage = 0;
        } else if (currentPage > pages) {
          currentPage = pages;
        }

        return false;
      }
    });

    if (currentPage !== page) {
      page = currentPage;
      $(handler).trigger('letterChange', page);
    }
  });

  // Do it on the next free cycle to ensure the event has been added
  setTimeout(function () {
    $monkey.triggerHandler('scroll');
  });

  return handler;
};
