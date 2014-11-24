/* global describe, it, monkey */

'use strict';

describe('Using monkey on mobile', function () {
  var $monkey, promise;
  var $container = $('<div />').attr('data-key', 'lmn-book');

  before(function () {
    promise = new Monkey($container, {
      monkeyType: 'mobile',
      book: options.book
    }).promise;

    return promise.then(function () {
      $monkey = $container.find('.monkey');
      $container.appendTo('body');
    });
  });

  it('should be initiated', function () {
    $container.children().length.should.equal(3);
  });

  it('should scroll', function () {
    $monkey.scrollLeft(100);
    $monkey.scrollLeft().should.equal(100);
  });

  it('should change letters when page is changed', function () {
    $monkey.scrollLeft($monkey.find('div').width() / 2).trigger('scroll');
    $container.find('.letter-active').index().should.be.within(4, 6);
  });

  it('should display buy now button correctly', function () {
    var shouldBe = $monkey.hasClass('portrait') ? 'hidden' : 'visible';
    $container.find('.buy-now').is(':' + shouldBe).should.be.True;
  });

  after(function () {
    $container.remove();
  });
});
