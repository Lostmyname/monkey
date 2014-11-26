/* global describe, it, monkey */

'use strict';

describe('Monkey helpers', function () {
  var helpers = Monkey.helpers;

  it('should support string replacements', function () {
    var handleReplace = helpers.handleReplace;
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

  it('should remember previous replacements object', function () {
    var handleReplace = helpers.handleReplace;
    handleReplace('{{ foo }}').should.equal('bar');
  });

  it('should correctly detect mobile', function () {
    helpers.isMobile().should.be.Boolean;
  });

  it('should preload multiple images (slow)', function () {
    var randomImages = [getRandomImage(), getRandomImage()];
    return helpers.preload(randomImages)
      .then(function ($images) {
        $images.should.be.a.jqObject;
        $images.length.should.equal(2);
        $images.eq(0).attr('src').should.equal(randomImages[0]);
        $images.eq(1).attr('src').should.equal(randomImages[1]);
      });
  });

  var randomImage = getRandomImage();
  it('should preload single image (slow)', function () {
    return helpers.preload(randomImage)
      .then(function ($images) {
        $images.should.be.a.jqObject;
        $images.length.should.equal(1);
        $images.attr('src').should.equal(randomImage);
      });
  });

  // This is only actually slow if above tests are ommitted
  it('should accept callbacks (slow)', function (cb) {
    helpers.preload(randomImage, function ($images) {
      $images.should.be.a.jqObject;
      $images.length.should.equal(1);
      $images.attr('src').should.equal(randomImage);
      cb();
    });
  });
});
