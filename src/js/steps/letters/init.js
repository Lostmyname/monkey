'use strict';

var $ = require('jquery');

module.exports = function ($events) {
  return function (data) {
    var $letters = data.lettersElement.find('#letters');
    var $spans = $letters.find('span');
    var $charButtons = $letters.find('button')

    $events.on('letterChange', function (e, page) {
      var currentPage = Math.floor((page - 1) / 2);
      if (currentPage < 0) {
        currentPage = 0;
      } else if (currentPage > $spans.length - 1) {
        currentPage = $spans.length - 1;
      }

      $spans
        .filter('.letter-active')
          .removeClass('letter-active')
          .end()
        .eq(currentPage)
          .addClass('letter-active');
    });

    $letters.on('click', 'span', function () {
      var $this = $(this);

      var charsBefore = $this.prevAll('.special-char').length;
      data.turnToPage($this.index() - charsBefore);
    });

    $charButtons.on('click', function () {
      var $buttonEl = $(this);
      var character = $buttonEl.data('char');
      var page = $buttonEl.data('page');

      var selectedChar = $('#letters .letter-active').find('.selected-char');
      selectedChar.removeClass('selected-char');
      var $prevButton = selectedChar.find('button');
      $prevButton
        .attr('disabled', false)
        .text('select')
        .addClass('primary');

      $buttonEl
        .attr('disabled', true)
        .removeClass('primary')
        .text('selected');
      $buttonEl.parent().addClass('selected-char')
      data.swapPage(page, character);
    })

    return data;
  };
};
