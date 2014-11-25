'use strict';

/**
 * Preload images and fire a callback / promise when they're loaded.
 *
 * @param {string|string[]} images String(s) containing URL(s) to preload.
 * @param {function} [callback] Optional callback. Promises are better!
 * @returns {promise} Promise which will be resolved when all the images
 *                    have loaded.
 */
module.exports = function preload(images, callback) {
  var defer = $.Deferred();

  if (!$.isArray(images)) {
    images = [images];
  }

  var toLoad = images.length;

  var $images = $.map(images, function (image) {
    var $image = $('<img />').attr('src', image);

    $image.on('load', function () {
      if (--toLoad === 0) {
        defer.resolve($images);
      }
    });

    return $image;
  });

  // Convert array of jQuery objects into jQuery object
  $images = $($images).map(function () {
    return this.toArray();
  });

  var promise = defer.promise();

  if (typeof callback === 'function') {
    promise.then(callback);
  }

  return promise;
};
