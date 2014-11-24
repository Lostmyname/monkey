/* global describe, it, monkey */

'use strict';

describe('Using monkey on desktop', function () {
  var data, promise;
  var $container = $('<div />').attr('data-key', 'lmn-book');

  before(function () {
    this.timeout(4000);

    promise = new Monkey($container, {
      monkeyType: 'desktop',
      book: bookData
    }).promise;

    return promise.then(function (dataa) {
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

  after(function () {
    $container.remove();
  });
});
