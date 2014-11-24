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
  };
}

var options = {
  book: {
    name: 'Heidelberg',
    gender: 'girl',
    locale: 'en-GB'
  },
  lang: {
    buyNow: 'Buy now',
    bookFor: 'A personalised book for'
  },
  server: 'https://secure.lostmy.name/widgets/actuallymonkey.json?callback=?'
};
