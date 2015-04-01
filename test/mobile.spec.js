/* global $, Monkey, options */

'use strict';

describe('Using monkey on mobile', function () {
  var $monkey, monkey;
  var $container = $('<div />').attr('data-key', 'lmn-book');

  before(function () {
    monkey = new Monkey($container, {
      monkeyType: 'mobile',
      book: options.book
    });

    return monkey.promise.then(function () {
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

  it('should fire event when scrolled', function (cb) {
    this.timeout(500); // If it isn't fired in this time, it won't be

    monkey.$events.on('halfway', function () { cb(); });
    $monkey.scrollLeft($monkey.find('div').width() / 1.5).trigger('scroll');
  });

  it('should display buy now button correctly', function () {
    var shouldBe = $monkey.hasClass('portrait') ? 'hidden' : 'visible';
    $container.find('.buy-now').is(':' + shouldBe).should.be.True;
  });

  after(function () {
    $container.remove();
  });
});
