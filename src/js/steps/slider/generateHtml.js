import $ from 'jquery';

/**
 * Generate HTML for slider.
 *
 * @param {object} options Options passed to monkey.
 */
export default function (options) {
  return function (data) {
    var $sliderContainer = $('<div />', {
      id: 'slider-container',
      class: 'row aligned-center md-mar-b',
      'data-key': 'monkey-slider'
    });

    $('<p />').appendTo($sliderContainer)
      .addClass('no-mar')
      .text(options.lang.bookFor);

    $('<h3 />').appendTo($sliderContainer)
      .addClass('h5')
      .text(options.lang.bookTo);

    var $sliderInnerContainer = $('<div />').appendTo($sliderContainer)
      .addClass('col col-lg-6 col-lg-offset-3 col-sm-12 col-sm-offset-0');

    $('<input />', { type: 'range' })
      .appendTo($sliderInnerContainer);

    var $book = data.monkeyContainer;

    data.sliderElement = $sliderContainer.appendTo($book);

    return data;
  };
}
