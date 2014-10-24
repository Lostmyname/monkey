/* global Should */

'use strict';

Should.Assertion.add('jqPromise', function () {
  this.params = { operator: 'to be jQuery Deferred / Promise' };

  this.obj.should.be.type('object');
  this.obj.then.should.be.type('function');
  $.Deferred().then.toString().should.equal(this.obj.then.toString());
}, true);
