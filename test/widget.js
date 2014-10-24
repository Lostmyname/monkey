/* global describe, it, widget */

'use strict';

describe('Tests', function () {
  it('should function', function () {
    (10).should.be.above(2);
  });

  it('should have jqPromise test', function () {
//    var promise = $.Deferred().promise();
//    promise.should.be.a.jqPromise;
//    $.should.not.be.a.jqPromise;
  });

  it('should have everything they need', function () {
    widget.should.be.type('object');
  });
});

describe('Widget Setup', function () {
  var promise;

  it('should get data', function (done) {
    widget.should.have.property('_getData');

    promise = widget._getData();

//    promise.should.be.jqPromise();

    promise.then(function (data) {
      data.should.have.property('name');
      data.should.have.property('gender');
      data.should.have.property('locale');
      data.letters.should.be.an.Array;
      data.letters.length.should.be.above(10);

      done();
    })
  });
});
