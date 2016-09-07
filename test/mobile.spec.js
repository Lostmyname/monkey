/* global $, Monkey, options */

'use strict';

describe('Using monkey on mobile', function () {
  var $monkey, monkey;
  var $container = $('<div />').attr('data-key', 'lmn-book');

  before(function () {
    monkey = new Monkey($container, {
      monkeyType: 'mobile',
      book: {
        name: 'Tal',
        gender: 'boy',
        locale: 'en-GB'
      }
    });

    return monkey.promise.then(function (data) {
      data.html.trigger('touchstart');

      $monkey = $container.find('.monkey-wrapper');
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
      $container.find('.letter-active').index().should.be.within(2, 4);
      done();
    }, 300);
  });

  it('should fire event when scrolled', function (cb) {
    this.timeout(500); // If it isn't fired in this time, it won't be
    monkey.$events.on('halfway', function () {
      cb();
    });
    $monkey.scrollLeft($monkey.find('.landscape-images-inner').width() / 1.5).trigger('scroll');
  });

  after(function () {
    $container.remove();
  });
});

describe('Using TJH monkey on mobile', function () {
  var $monkey, monkey, monkeyData;
  var $container = $('<div />')
    .attr('id', 'monkey')
    .attr('data-key', 'tjh-book');

  before(function () {
    monkey = new Monkey($container, {
      monkeyType: 'mobile',
      letters: false,
      platformAPI: true,
      server: 'https://prod1-platform.lostmy.name',
      serverPath: 'product-builder/tjh/images',
      book: {
        name: 'Tal',
        gender: 'boy',
        locale: 'en-gb',
        inscription: 'test',
        country_code: 'gb', // eslint-disable-line camelcase
        address: '',
        door_number: '10', // eslint-disable-line camelcase
        lat: '51.171223',
        lng: '-1.789289',
        phototype: 'type-ii'
      }
    });

    return monkey.promise.then(function (data) {
      data.animateToPage = true;
      data.html.trigger('touchstart');
      monkeyData = data;
      $monkey = $container.find('.monkey-wrapper');
      $container.appendTo('body');
    });
  });

  it('should be initiated', function () {
    $container.children().length.should.equal(1);
  });

  it('should have the animateToPage value set to true', function () {
    monkeyData.animateToPage.should.equal(true);
  });

  it('should change the page with the turnToPage function', function (done) {
    monkey.turnToPage(5);
    setTimeout(function () {
      if ($monkey.scrollLeft() > 0) {
        done();
      }
    }, 500);
  });
});
