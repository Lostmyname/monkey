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
  var promise;

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
        url.should.containEql('?w=');
      }
    });
  });

  it('should generate HTML', function () {
    promise = promise.then(monkey._generateHtml());

    return promise.then(function (data) {
//      data.should.have.property('html');
//      data.html.should.be.instanceOf(jQuery);
//      data.html.should.containEql(data.urls[2])
    });
  });

  it('should get correct HTML function for mobile', function () {
    var oldIsMobile = monkey.helpers.isMobile;
    monkey.helpers.isMobile = function () { return true; }

    monkey._generateHtml().name.should.equal('mobile');

    monkey.helpers.isMobile = oldIsMobile;
  });

  it('should get correct HTML function for desktop', function () {
    var oldIsMobile = monkey.helpers.isMobile;
    monkey.helpers.isMobile = function () { return false; }

    monkey._generateHtml().name.should.equal('desktop');

    monkey.helpers.isMobile = oldIsMobile;
  });

  it('should insert HTML correctly', function () {
    var $book = $('.lmn-book');
    $book.children().length.should.equal(0);

    promise = promise.then(monkey._insertHtml($book));

    return promise.then(function (data) {
      $book.children().length.should.not.equal(0);

      $book.find('img').length.should.equal(data.urls.length + 1);
    });
  });
});
