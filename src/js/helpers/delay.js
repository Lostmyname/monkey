var $ = require('jquery');

module.exports = function (time) {
  var deferred = $.Deferred();

  setTimeout(function () {
    deferred.resolve();
  }, time);

  return deferred.promise();
};
