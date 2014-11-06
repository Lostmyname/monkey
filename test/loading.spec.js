/* global describe, it, monkey */

'use strict';

describe('Loading Monkey', function () {
  var promise, promiseBeforeHtml;

  it('should have an init function that accept options', function () {
    var $testObject = $('<div />').attr('data-key', 'lmn-book');
    return monkey.init($testObject, {
      buyNow: 'testTESTtest',
      letters: false,
      monkeyType: 'mobile'
    }).then(function (data) {
      $testObject.children().length.should.be.above(0);
      data.html[0].should.equal($testObject.children()[0]);

      var html = $testObject.html();
      html.should.containEql('testTESTtest');
    });
  });

  it('should get data', function () {
    monkey.should.have.property('_getData');

    promise = monkey._getData();
    promise.should.be.jqPromise;

    return promise.then(function (data) {
      data.should.have.property('name');
      data.should.have.property('gender');
      data.should.have.property('locale');
      data.letters.should.be.an.Array;
      data.letters.length.should.be.above(10);

      data.should.not.have.property('urls');
      data.should.not.have.property('html');
    });
  });

  it('should set monkeyType', function () {
    promise = promise.then(monkey._calculateMonkey());
    promiseBeforeHtml = promise;

    return promise.then(function (data) {
      data.should.have.property('monkeyType');
      data.monkeyType.should.match(/[desktop|mobile]/);
    });
  });

  it('should set monkeyType with option desktop', function () {
    return promise.then(monkey._calculateMonkey('desktop'))
      .then(function (data) {
        data.should.have.property('monkeyType');
        data.monkeyType.should.equal('desktop');
      });
  });

  it('should set monkeyType with option auto', function () {
    return promise.then(monkey._calculateMonkey('auto'))
      .then(function (data) {
        data.should.have.property('monkeyType');
        data.monkeyType.should.match(/[desktop|mobile]/);
      });
  });

  it('should generate URLs', function () {
    promise = promise.then(monkey._generateUrls());

    return promise.then(function (data) {
      data.should.have.property('urls');
      data.urls.should.have.length(data.letters.length);

      for (var i = 0; i < data.urls.length; i++) {
        var url = data.urls[i];

        url.should.be.a.String;
        url.should.startWith('//');

        url.length.should.be.above(50);
        url.should.match(/[?&]h=\d+/);
        url.should.match(/[?&]dpr=\d+/);
      }
    });
  });

  it('should generate HTML for desktop', function () {
    return promise.then(changeMonkeyType('desktop'))
      .then(monkey._generateHtml())
      .then(function (data) {
        data.should.have.property('html');
        data.html.should.be.instanceOf(jQuery);
        data.html.hasClass('desktop').should.be.True;
        data.html.html().should.containEql(data.urls[2].split('?')[0])
      });
  });

  it('should generate HTML for mobile', function () {
    return promise.then(changeMonkeyType('mobile'))
      .then(monkey._generateHtml())
      .then(function (data) {
        data.should.have.property('html');
        data.html.should.be.instanceOf(jQuery);
        data.html.hasClass('mobile').should.be.True;
        data.html.html().should.containEql(data.urls[2].split('?')[0])
      });
  });

  it('should insert HTML correctly on desktop', function () {
    var $book = $('<div />').attr('data-key', 'lmn-book');
    $book.children().length.should.equal(0);

    return promise.then(changeMonkeyType('desktop'))
      .then(monkey._generateHtml())
      .then(monkey._initMonkey())
      .then(monkey._insertHtml($book))
      .then(function (data) {
        $book.children().length.should.not.equal(0);

        $book.find('img').length.should.equal(data.urls.length * 2 + 2);

        data.should.have.property('container');
      });
  });

  it('should insert HTML correctly on mobile', function () {
    var $book = $('<div />').attr('data-key', 'lmn-book');
    $book.children().length.should.equal(0);

    return promise.then(changeMonkeyType('mobile'))
      .then(monkey._generateHtml())
      .then(monkey._initMonkey())
      .then(monkey._insertHtml($book))
      .then(function (data) {
        $book.children().length.should.not.equal(0);

        $book.find('img').length.should.equal(data.urls.length + 1);

        data.should.have.property('container');
      });
  });

  it('should generate letters HTML correctly', function () {
    promise = promise.then(monkey.letters._generateHtml());

    return promise.then(function (data) {
      data.letters.find('span span').length.should.equal(data.name.length + 2);
    });
  });

  it('should generate spread HTML');

  it('should insert spread');

  it('should generate letters HTML in a selector correctly', function () {
    var $insertHere = $('<div />');

    promise.then(monkey.letters._generateHtml($insertHere))
      .then(function (data) {
        $insertHere.find('span span').length.should.equal(data.name.length + 2);
      });
  });

  it('should initiate letters correctly', function () {
    var handler = {};

    monkey.monkeys.test = {
      letterHandler: function () { return handler }
    };

    promise = promise.then(changeMonkeyType('test'))
      .then(monkey.letters._init())

    return promise.then(function (data) {
      $(handler).trigger('letterChange', 7);
      data.letters.find('.letter-active').index().should.equal(3);
    });
  });

  it('should not insert buy now button when not mobile', function () {
    promise = promise.then(monkey._addBuyNow());

    return promise.then(function (data) {
      var $buyNow = data.html.parents('[data-key="lmn-book"]').find('.buy-now');

      $buyNow.length.should.equal(0);
    });
  });

  it('should insert buy now button', function () {
    promise = promise.then(changeMonkeyType('mobile'))
      .then(monkey._addBuyNow('http://google.com/'));

    return promise.then(function (data) {
      var $buyNow = data.html.parents('[data-key="lmn-book"]').find('.buy-now');

      $buyNow.length.should.equal(1);

      data.buyNow[0].should.equal($buyNow[0]);
    });
  });
});
