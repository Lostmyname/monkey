/* global describe, it, monkey */

'use strict';

describe('Using monkey on desktop', function () {
  var promise;
  var $container = $('<div />').attr('data-key', 'lmn-book');

  it('should be initiated', function () {
    promise = monkey.init($container, { monkeyType: 'desktop' });

    return promise.then(function () {
      $container.children().length.should.equal(2);

      $container.appendTo('body');
    });
  });

  it('should change page when clicked', function () {
    var $active = $container.find('.is-active').eq(1);

    $active.click();

    $container.find('.is-active').get(1).should.not.equal($active.get(0));
  });

  it('should change letters when page is changed', function () {
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
