'use strict';

var fs = require('fs');

var delve = require('delve');
var nunjucks = require('nunjucks');
var objToAttrs = require('obj-to-attrs');
var yaml = require('js-yaml');

module.exports = function () {
  return function (done) {
    var base = fs.readFileSync('demo/base.erb.html', 'utf8');
    var partial = fs.readFileSync('src/partials/partial.erb.html', 'utf8');

    base = base.replace('<%= partial %>', partial);

    var env = nunjucks.configure({
      watch: false,
      tags: {
        variableStart: '<%=',
        variableEnd: '%>'
      }
    });

    var lang = yaml.safeLoad(fs.readFileSync('src/en.yml', 'utf8'));

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    var context = {
      name: 'monkey',
      t: function translate(text) {
        return delve(lang.en['component.monkey'], text);

      },
      image_path: function (path) {
        return getImagePath(path);
      },
      image_tag: function (path, options) {
        path = getImagePath(path);
        return '<img src="' + path + '" ' + objToAttrs(options) + '>';
      }
    };
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    function getImagePath(path) {
      return '../../src/imgs/' + path;
    }

    // HELL
    env.renderString(base, context, function (err, res) {
      if (err) {
        return done(err);
      }

      fs.mkdir('demo/partials', function (err) {
        if (err && err.code !== 'EEXIST') {
          return done(err);
        }

        fs.writeFile('demo/partials/partial.html', res, function (err) {
          if (err) {
            return done(err);
          }

          done();
        });
      });
    });
  };
};
