/* global $, Should */
/* jshint unused: false */

'use strict';

Should.Assertion.add('jqPromise', function () {
  this.params = { operator: 'to be jQuery Deferred / Promise' };

  this.obj.should.be.type('object');
  this.obj.then.should.be.type('function');
  $.Deferred().then.toString().should.equal(this.obj.then.toString());
}, true);

Should.Assertion.add('jQuery', function () {
  this.params = { operator: 'to be jQuery object' };

  this.jquery.should.be.type('string');
  this.jquery.should.equal($.fn.jquery);
});

function changeMonkeyType(type) {
  return function (data) {
    data.monkeyType = type;
    return data;
  };
}

function getRandomImage() {
  var img = '//lmn-assets.imgix.net/widget/en-GB/v2/girl/R_Robot_s_Page_2.jpg?h=1000&dpr=1&q=60';
  return img.replace('1000', 200 + Math.floor(Math.random() * 100));
}

var options = {
  book: {
    name: 'Heidelberg',
    gender: 'girl',
    locale: 'en-GB'
  },
  lang: {
    bookFor: 'A personalised book made for',
    noAltText: 'No alternative text for this page, sorry.'
  },
  server: 'https://secure.lostmy.name/widgets/actuallymonkey.json?callback=?',
  icons: true
};
