'use strict';

var mobile = module.exports = {};

mobile.generateHtml = function mobile (monkey, data) {
  var $monkey = $('<div />').addClass('monkey');
  var $images = $('<div />').appendTo($monkey)
    .addClass('landscape-images');
  var $inner = $('<div />').appendTo($images)
    .addClass('landscape-images-inner');

  $.each(data.urls, function (i, url) {
    var $page = $('<div />').appendTo($inner).addClass('page');

    if (i === 0) {
      $('<div />').appendTo($page)
        .addClass('heidelberg-tapToOpen')
        .append($('<img />').attr('src', monkey._urls.bookTip));
    }

    $('<img />').appendTo($page).attr('src', url);
  });

  return $monkey;
};

mobile.init = function ($monkey) {
  var portrait;
  var windowLeft = 0;

  $(window).on('orientationchange resize', function () {
    portrait = (window.innerHeight > window.innerWidth);

    // Make images 100% high. Temporary hack, should use CSS.
    var height = portrait ? 'auto' : $(window).height();
    $('.landscape-images .page img').css('height', height);

    $('.monkey, body').removeClass('landscape portrait')
      .addClass(portrait ? 'portrait' : 'landscape');

    $monkey.scrollLeft($monkey.find('img').width() * windowLeft);
  });
  $(window).triggerHandler('resize');

  $monkey.on('scroll', function () {
    windowLeft = $monkey.scrollLeft() / $monkey.find('img').width();
  });
};
