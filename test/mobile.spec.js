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

    return monkey.promise.then(function (data) {
      data.html.trigger('touchstart');

      $monkey = $container.find('.monkey');
      $container.appendTo('body');
    });
  });

  it('should be initiated', function () {
    $container.children().length.should.equal(2);
  });

  it('should scroll', function () {
    $monkey.scrollLeft(100);
    $monkey.scrollLeft().should.equal(100);
  });

  it('should change letters when page is changed', function (done) {
    $monkey
      .scrollLeft($monkey.find('.landscape-images-inner').width() / 2)
      .trigger('scroll');

    setTimeout(function () {
      $container.find('.letter-active').index().should.be.within(4, 6);
      done();
    }, 3000);
  });

  it('should fire event when scrolled', function (cb) {
    this.timeout(500); // If it isn't fired in this time, it won't be

    monkey.$events.on('halfway', function () { cb(); });
    $monkey.scrollLeft($monkey.find('.landscape-images-inner').width() / 1.5).trigger('scroll');
  });

  after(function () {
    $container.remove();
  });
});
