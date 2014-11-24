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

var fakeLang = {
  buyNow: 'Buy now',
  bookFor: 'A personalised book for'
};

var bookData = {
  name: 'Heidelberg',
  gender: 'girl',
  locale: 'en-GB'
};

var options = {
  book: bookData,
  server: 'https://secure.lostmy.name/widgets/actuallymonkey.json?callback=?'
};
