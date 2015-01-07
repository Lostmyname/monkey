/* global Monkey, ScrollMagic, ScrollScene, TweenLite */

'use strict';

$('form', '#lmn-hero-form').on('submit', function (e) {
  e.preventDefault();

  var monkey = new Monkey('.lmn-book', {
    book: {
      name: $(this.name).val(),
      gender: $(this.gender).filter(':checked').val(),
      locale: 'en-GB'
    }
  });

  monkey.promise.then(function (data) {
    if (data.monkeyType === 'desktop') {
      data.html.closest('.lmn-book').addClass('container').css('max-width', '25rem');

      var controller = new ScrollMagic();

      $([1, 2, 3, 4, 5]).each(function (index, number) {
        var $element = $('#text' + number);

        new ScrollScene({ triggerElement: '#text' + number, duration: 300 })
          .setPin('#text' + number)
          .addTo(controller)
          .on('enter', function () {
            data.heidelberg.turnPage($element.data('page'));
          });
      });

      var tween = TweenLite.to('.lmn-book', 0.5, {
        maxWidth: '1280px',
        left: 0,
        marginLeft: 0
      });

      new ScrollScene({ triggerElement: '.biggerTrigger', duration: 300 })
        .setTween(tween)
        .addTo(controller);
    }
  });

  $('#lmn-hero-form').fadeOut(function () {
    $('#lmn-product-hero').hide().removeClass('hidden').fadeIn();
  });
});
