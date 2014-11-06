/* global Should */

'use strict';

Should.Assertion.add('jqPromise', function () {
  this.params = { operator: 'to be jQuery Deferred / Promise' };

  this.obj.should.be.type('object');
  this.obj.then.should.be.type('function');
  $.Deferred().then.toString().should.equal(this.obj.then.toString());
}, true);

function changeMonkeyType(type) {
  return function (data) {
    data.monkeyType = type;
    return data;
  }
}

// Hacky fix: see shouldjs/should.js#20
Element.prototype.inspect = function () {
  return this.outerHTML;
};

// Idek: shouldjs/should.js#22
XMLHttpRequest.prototype.inspect = function () {
  return '[XMLHttpRequest]';
}
