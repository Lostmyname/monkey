/* global should */

'use strict';

should.Assertion.add('jqPromise', function () {
  this.params = { operator: 'to be jQuery Deferred / Promise' };

  this.then.should.be.type('function');
  $.Deferred().then.toString().should.equal(this.then.toString());
}, true);
