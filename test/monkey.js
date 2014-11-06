/* global describe, it, monkey */

'use strict';

describe('Tests', function () {
  it('should function', function () {
    (10).should.be.above(2);
  });

  it('should have everything they need', function () {
    monkey.should.be.type('object');
    $.should.be.type('function');
  });

  it('should have jqPromise test', function () {
    var promise = $.Deferred().promise();
    promise.should.be.a.jqPromise;
    $.should.not.be.a.jqPromise;
  });
});

describe('Monkey helpers', function () {
  it('should support string replacements', function () {
    var handleReplace = monkey.helpers.handleReplace;
    var replacements = { foo: 'bar', hello: 'world', empty: '' };

    var replaces = {
      '{{ foo }}': 'bar',
      ' {{hello}}': ' world',
      '{{ nope }}': '{{ nope }}',
      '{{ empty}}': '',
      '{ {test} }': '{ {test} }'
    };

    $.each(replaces, function (input, output) {
      handleReplace(input, replacements).should.equal(output);
    });
  });

  it('should remember previous replacements object', function () {
    var handleReplace = monkey.helpers.handleReplace;
    handleReplace('{{ foo }}').should.equal('bar');
  });

  it('should correctly detect mobile', function () {
    monkey.helpers.isMobile().should.be.Boolean;
  });
});

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
    var $book = $('.lmn-book-desktop');
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
    var $book = $('.lmn-book-mobile');
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
});

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

describe('Using monkey on mobile', function () {
  var promise;
  var $container = window.a = $('<div />').attr('data-key', 'lmn-book');
  var $monkey;

  it('should be initiated', function () {
    promise = monkey.init($container, { monkeyType: 'mobile' });

    return promise.then(function () {
      $container.children().length.should.equal(3);
      $monkey = $container.find('.monkey');

      $container.appendTo('body');
    });
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
