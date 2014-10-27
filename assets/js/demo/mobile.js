'use strict';

var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
var portrait;
var windowLeft = 0;

if (supportsTouch) {
  $(window).on('orientationchange resize', function () {
    portrait = (window.innerHeight > window.innerWidth);

    // Make images 100% high. Temporary hack, should use CSS.
    var height = portrait ? 'auto' : $(window).height();
    $('.landscape-images .page img').css('height', height);

    $('.monkey, body').removeClass('landscape portrait')
      .addClass(portrait ? 'portrait' : 'landscape');

    $('.monkey').scrollLeft($('.monkey img').width() * windowLeft);
  });
  $(window).triggerHandler('resize');
}

$('.monkey').on('scroll', function () {
  windowLeft = $('.monkey').scrollLeft() / $('.monkey img').width();
});
