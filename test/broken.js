/* global describe, it */

'use strict';

describe('Crashing chrome :/', function () {
  var promise;

  it('should create promise', function () {
    var defer = $.Deferred();

    setTimeout(function () {
      defer.resolve({ foo: 'bar' });
    }, 10);

    return (promise = defer.promise());
  });

  it('should have foo', function () {
    promise = promise.then(function (data) {
      data.should.have.property('foo');

      return data;
    });
    return promise;
  });

  it('shouldnt crash!!', function () {
    promise = promise.then(function (data) {
      data.html = $('<div />');
      return data;
    });

    return promise.then(function (data) {
      ({}).should.not.have.property('bla'); // This line does not crash it
      data.should.have.property('foo'); // This line does
    });
  });
});
