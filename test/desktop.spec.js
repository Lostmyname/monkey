/* global $, Monkey, options */

'use strict';

describe('Using monkey on desktop', function () {
  var data, monkey;
  var $container = $('<div />').attr('data-key', 'lmn-book');

  before(function () {
    this.timeout(4000);

    monkey = new Monkey($container, {
      monkeyType: 'desktop',
      book: options.book
    });

    return monkey.promise.then(function (dataa) {
      $container.appendTo('body');
      data = dataa;
    });
  });

  it('should be initiated', function () {
    $container.children().length.should.equal(2);
  });

  it('should change page when clicked', function () {
    var $active = $container.find('.is-active').eq(1);

    $active.click();

    $container.find('.is-active').get(1).should.not.equal($active.get(0));
  });

  // @todo: fix in IE
  it('should change letters when page is changed (noIE)', function () {
    var letterActive = $container.find('.letter-active')[0];

    for (var i = 0; i < 7; i++) {
      $container.find('.is-active').eq(1).click();
    }

    var $newActive = $container.find('.letter-active');

    $newActive.eq(0).index().should.equal(3);
    $newActive[0].should.not.equal(letterActive);
  });

  it('should fire event when clicked', function (cb) {
    monkey.$events.on('pageTurn', function () { cb(); });
    $container.find('.is-active').eq(1).click();
  });

  after(function () {
    $container.remove();
  });

  describe('Special Characters for separating names', function () {
    var data, monkey;
    var $container = $('<div />').attr('data-key', 'lmn-book');

    before(function () {
      options.book.name = 'Mary Mary-Jane';
      this.timeout(4000);

      monkey = new Monkey($container, {
        monkeyType: 'desktop',
        book: options.book
      });

      return monkey.promise.then(function (dataa) {
        $container.appendTo('body');
        data = dataa;
      });
    });

    it('should not make hyphens in names clickable', function () {
      $container.find('.nonclickable.special-char .char:contains(-)').length.should.equal(1);
    });

    it('should not make spaces in names clickable', function () {
      $container.find('.nonclickable.special-char .char:contains( )').length.should.equal(1);
    });

    after(function () {
      $container.remove();
    });
  });
});
