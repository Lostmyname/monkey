import $ from 'jquery';

/**
 * Generate HTML for slider.
 *
 * @param {object} options Options passed to monkey.
 */
export default function (options, lang) {
  return function (data) {
    var $sliderContainer = $('<div />', {
      id: 'slider-container',
      'class': 'row aligned-center md-mar-b',
      'data-key': 'monkey-slider'
    });

    $('<p />').appendTo($sliderContainer)
      .addClass('no-mar')
      .text(lang.bookFor);

    var $sliderInnerContainer = $('<div />').appendTo($sliderContainer)
      .addClass('col col-lg-6 col-lg-offset-3');

    $('<input />', { type: 'range' })
      .appendTo($sliderInnerContainer);

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
