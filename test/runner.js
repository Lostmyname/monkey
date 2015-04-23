'use strict';

var MochaSauce = require('mocha-sauce');

var sauce = new MochaSauce({
  name: 'monkey',
  username: 'callumacrae',
  accessKey: 'ba624b24-bc4a-40e9-8ad2-c55ef1d5aa10',
  host: 'localhost',
  port: 4445,

  url: 'http://localhost/test/index.html'
});

sauce.browser({ browserName: 'Chrome', platform: 'OS X' });
sauce.browser({ browserName: 'Safari', platform: 'iOS' });

sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start();
