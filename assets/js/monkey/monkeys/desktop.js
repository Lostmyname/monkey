/* global Heidelberg */

'use strict';

var desktop = module.exports = {};

desktop.generateHtml = function (monkey, data) {
  var $monkey = $('<div />').addClass('Heidelberg-Book with-Spreads desktop');

  $.each(data.urls, function (i, url) {
    var $page = $('<div />').appendTo($monkey).addClass('Heidelberg-Spread');

    if (i === 0) {
      $('<div />').appendTo($page)
        .addClass('heidelberg-tapToOpen')
        .append($('<img />').attr('src', monkey._urls.bookTipTap));
    }

    $('<img />').appendTo($page).attr('src', url);
  });

  return $monkey;
};

desktop.init = function (monkey, data) {
  data.heidelberg = new Heidelberg(data.html, {
    hasSpreads: true
  });
};
