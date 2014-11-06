/* global describe, it, monkey */

'use strict';

describe('Monkey helpers', function () {
  it('should support string replacements', function () {
    var handleReplace = monkey.helpers.handleReplace;
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
    var handleReplace = monkey.helpers.handleReplace;
    handleReplace('{{ foo }}').should.equal('bar');
  });

  it('should correctly detect mobile', function () {
    monkey.helpers.isMobile().should.be.Boolean;
  });
});
