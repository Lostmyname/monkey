/* global analytics */

'use strict';

/**
 * Initializes Monkey by adding a turnToPage method, which differs depending
 * whether you're on a mobile device or desktop. This function is defined in
 * /src/js/monkeys/mobile.js and /src/js/monkeys/desktop.js respectively.
 *
 * @param  {object} $events The global Monkey events object, used to pass custom
 * events to it.
 * @param  {object} options The options that Monkey was initialized with.
 * @return {data} The data object passed through the Promise chain.
 */
module.exports = function ($events, options) {
  return function (data) {
    // Adds the turnToPage method, using data.monkeyType to determine whether
    // it should be desktop or mobile initialisation.
    if (options.clearSelection) {
      $events.trigger('clearCharSelection');
    }
    data.turnToPage = this.monkeys[data.monkeyType].init(data, $events, options);

    data.monkeyContainer.addClass('ready');

    // Track errors on image load
    var $images = data.monkeyContainer.find('[class*="page"] img');
    $images.on('error', function () {
      if (window.analytics) {
        analytics.track('Broken image in monkey', {
          src: this.src,
          pageID: this.getAttribute('data-id')
        });
      }
    });

    var remaining = $images.filter(function () {
      return !this.complete;
    }).length;

    $images.on('load', function () {
      remaining--;

      if (!remaining && window.analytics && options.platformAPI) {
        analytics.track('Monkey images all loaded');
      }
    });

    return data;
  }.bind(this);
};
