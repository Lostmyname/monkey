/* global describe, it, widget */

'use strict';

describe('Tests', function () {
  it('should function', function () {
    (10).should.be.above(2);
  });

  it('should have jqPromise test', function () {
    var promise = $.Deferred().promise();
    promise.should.be.a.jqPromise;
    $.should.not.be.a.jqPromise;
  });

  it('should have everything they need', function () {
    widget.should.be.type('object');
  });
});

describe('Widget Setup', function () {
  var promise;

  it('should get data', function () {
    widget.should.have.property('_getData');

    promise = widget._getData();
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
    promise = promise.then(widget._generateUrls);

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
    promise = promise.then(widget._generateHtml);

    return promise.then(function (data) {
      data.should.have.property('html');
      data.html.should.be.instanceOf(jQuery);
    });
  })
});
