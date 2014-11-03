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

  it('should correctly detect mobile', function () {
    monkey.helpers.isMobile().should.be.Boolean;
  });
});

describe('Loading Monkey', function () {
  var promise, promiseBeforeHtml;

  it('should have an init function that accept options');

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
        url.should.match(/(\?|&amp;)h=\d+/);
        url.should.match(/(\?|&amp;)dpr=\d+/);
      }
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

  it('should generate HTML for desktop', function () {
    return promise.then(changeMonkeyType('desktop'))
      .then(monkey._generateHtml())
      .then(function (data) {
//      data.should.have.property('html');
//      data.html.should.be.instanceOf(jQuery);
//      data.html.className.should.containEql('desktop');
//      data.html.should.containEql(data.urls[2])
    });
  });

  it('should generate HTML for mobile', function () {
    return promise.then(changeMonkeyType('mobile'))
      .then(monkey._generateHtml())
      .then(function (data) {
//        data.should.have.property('html');
//        data.html.should.be.instanceOf(jQuery);
//        data.html.className.should.containEql('mobile');
//        data.html.should.containEql(data.urls[2])
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

//        data.should.have.property('container');
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

//        data.should.have.property('container');
      });
  });

  it('should generate letters HTML correctly');
  it('should initiate letters correctly');
});

describe('Using monkey on desktop', function () {
  it('should be initiated');
  it('should change page when clicked');
  it('should change letters when page is changed');
});

describe('Using monkey on mobile', function () {
  it('should be initiated');
  it('should scroll');
  it('should change letters when page is changed');
  it('should display buy now button when landscape');
  it('should not display buy now button when portrait');
});
