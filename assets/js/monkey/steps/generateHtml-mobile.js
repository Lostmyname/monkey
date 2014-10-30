'use strict';

module.exports = function (monkey) {

  var mobileSetup = require('../monkeys/mobile').init;

  return function mobile (data) {
    var $monkey = data.html = $('<div />').addClass('monkey');
    var $images = $('<div />').appendTo($monkey)
      .addClass('landscape-images');
    var $inner = $('<div />').appendTo($images)
      .addClass('landscape-images-inner');

    $.each(data.urls, function (i, url) {
      var $page = $('<div />').appendTo($inner).addClass('page');

      if (i === 0) {
        $('<div />').appendTo($page)
          .addClass('heidelberg-tapToOpen')
          .append($('<img />').attr('src', monkey._urls.bookTip));
      }

      $('<img />').appendTo($page).attr('src', url);
    });

    mobileSetup($monkey);

    return data;
  };
};
