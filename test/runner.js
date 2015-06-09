// jshint es3: false

'use strict';

var path = require('path');
var connect = require('connect');
var serveStatic = require('serve-static');
var MochaSauce = require('mocha-sauce');
var exitCode = 0;

var port = 5412;

var sauce = new MochaSauce({
  name: 'monkey',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  host: 'localhost',
  port: port,

  url: 'http://localhost:' + port + '/test/index.html'
});

sauce.record(true);

sauce.browser({ browserName: 'chrome', platform: 'OS X 10.8' });

sauce.on('init', function(browser) {
  console.log('init: %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('start: %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('end: %s %s: %d failures', browser.browserName, browser.platform, res.failures);

  server.close();
  exitCode = res.failures;
});

var app = connect();
app.use(serveStatic(path.dirname(__dirname)));

var server = app.listen(port, function () {
  sauce.start(function (err) {
    if (err) {
      throw err;
    }
  });
});

process.on('beforeExit', function () {
  process.exit(exitCode);
});
