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
      'class': 'aligned-center row md-mar-b',
      'data-key': 'monkey-slider'
    });

    $('<input />', { type: 'range' })
      .appendTo($sliderContainer);

    var $book = false;
    if (typeof options.slider !== 'boolean') {
      $book = $(options.slider);
    }

    if (!$book || !$book.length) {
      $book = data.html.parents('[data-key="lmn-book"]');
    }

    data.sliderElement = $sliderContainer.prependTo($book);

    return data;
  };
}
