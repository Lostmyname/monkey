
'use strict';

var $ = require('jquery');
var Heidelberg = require('heidelberg');
var nums = require('nums');

var desktop = module.exports = {};

desktop.calculateSize = function () {
  var MAX_WIDTH = 1280;
  return Math.min($(window).width(), MAX_WIDTH);
};

/**
 * Adds the HTML to the page
 * @param  {object} data The data object
 * @param  {object} lang Default language object
 * @return {HTMLElement}      The monkey wrapper.
 */
desktop.generateHtml = function (data, lang) {
  var $monkey = $('<div />').addClass('Heidelberg-Book with-Spreads pos-absolute positioned-absolute');

  if (data.spreads === 'double') {
    $monkey.addClass('with-Spreads');
  }

  $('<a />', {
    href: '#skip-preview',
    className: 'for-screen-reader'
  })
    .text('Skip book preview')
    .appendTo(data.$monkeyWrapper);

  $.each(data.urls, function (i, url) {
    var $img = $('<img />', {
      src: url,
      alt: data.letters[i].text || lang.noAltText
    });

    $('<div />')
      .addClass('Heidelberg-' + (data.spreads === 'single' ? 'Page' : 'Spread'))
      .addClass('page-' + data.letters[i].type + ' Page-' + i)
      .append($img)
      .appendTo($monkey);

    $img.attr('data-id', data.letters[i].id);
  });
  $monkey.appendTo(data.$monkeyWrapper);

  $('<span />', { id: 'skip-preview' }).appendTo(data.$monkeyWrapper);

  return data.$monkeyWrapper;
};

// @todo document this.
desktop.init = function (data, $events, options) {
  var maxBookProgress = 0;
  var bookNavType;
  if (options.showCharPicker) {
    bookNavType = 'characterPicker';
  } else if (options.icons) {
    bookNavType = 'icons';
  } else {
    bookNavType = 'original';
  }

  data.drawPage;

  data.heidelberg = new Heidelberg(data.html.find('.Heidelberg-Book'), {
    arrowKeys: false,
    hasSpreads: (data.spreads === 'double'),
    limitPageTurns: false,
    canClose: options.canClose || false
  });

  data.swapPage = function (index, character) {
    var pageNumModifier = 3;
    var page = Number(index) * 2 + pageNumModifier;
    var $newImage = $('<img />')
      .attr('src', character.url1 + data.queryString);
    var $newImage2 = $('<img />')
      .attr('src', character.url2 + data.queryString);

    var newPage1 = $('<div />')
      .addClass('Heidelberg-Spread page- Page-' + page)
      .append($newImage.clone());

    var newPage2 = $('<div />')
      .addClass('Heidelberg-Spread page- Page-' + (page + 1))
      .append($newImage2.clone());

    var page1El = data.monkeyContainer.find('.Page-' + page);
    var page2El = data.monkeyContainer.find('.Page-' + (page + 1));
    page1El.replaceWith(newPage1);
    page2El.replaceWith(newPage2);

  };

  data.heidelberg.el.addClass('at-front-cover');

  $(data.heidelberg).on('pageTurn.heidelberg', function (e, $el, els) {
    var index = els.pages.index(els.pagesTarget);
    var bookProgress = index / els.pages.length;
    if (bookProgress > maxBookProgress) {
      maxBookProgress = bookProgress;
      $events.trigger('bookprogress', {
        progress: maxBookProgress,
        bookNavType: bookNavType });
    }
    $events.trigger('pageTurn', {
      monkeyType: data.container.parent().attr('data-book'),
      index: (index + 1) / 2
    });

    $el.toggleClass('at-front-cover', !index);
    $el.toggleClass('at-rear-cover', index === els.pages.length - (options.perPage / 2));

    if (index / els.pages.length > 0.5) {
      $events.trigger('halfway');
    }

    if (index === els.pages.length - (options.perPage / 2)) {
      $events.trigger('finished');
    }
  });

  return this.letterHandler(data, $events, options);
};

desktop.letterHandler = function (data, $events, options) {
  var fireEvent = true;
  var lastIndex = 0;

  $(data.heidelberg).on('pageTurn.heidelberg', function (e, el, els) {
    var newLastIndex = (els.pagesTarget.index() - 3) / 4;
    if (options.perPage === 2) {
      newLastIndex = (els.pagesTarget.index() + 1) / 2;
    }
    if (fireEvent) {
      // buddy ignore:start
      var index = (els.pagesTarget.index() - 1) / 2;
      $events.trigger('letterChange', index);
      lastIndex = newLastIndex;
      // buddy ignore:end
    }
  });

  // Do it on the next free cycle to ensure the event has been added
  setTimeout(function () {
    $events.trigger('letterChange', 0);
  });

  return function turnToPage(index) {
    fireEvent = false;
    // If already on the page, flip to the other page in the pair
    if (index === lastIndex) {
      index += index % 1 ? -0.5 : 0.5;
    }

    var PER_PAGE = options.perPage;
    var indexes = nums((lastIndex + 1) * PER_PAGE, (index + 1) * PER_PAGE);
    var doubleSpeed = (indexes.length > 10);
    index = Math.round(index);

    // If index ends .5, doubleSpeed doesn't work. Tbh I'm not sure why.
    // @todo: Think of a proper fix
    if (index % 1 !== 0) {
      doubleSpeed = false;
    }

    var DEFAULT_TIME = 30;
    var time = DEFAULT_TIME / (doubleSpeed ? 2 : 1);

    var currentTime = Date.now();
    var indexObject = [];
    /*
     * Loop through the indexes array to create a new array containing objects of the page index to turn to,
     * the time from the start when the pageTurn should occur, and a flag to determine whether the event has fired.
     */
    $.each(indexes, function (i, index) {
      // Happen only every 2 or 4 times
      if (!options.slider && index % (PER_PAGE / (doubleSpeed ? 2 : 1))) {
        return;
      }
      indexObject.push({
        pageIndex: Math.round(index) -1,
        time: i * time,
        hasFired: false
      });
    });

    /**
     * A rAF animation to turn the pages of the book, as the setTimeout method wasn't being very performant
     * @param  {object} manifest The object of indexes & times for when to fire the pages
     * @return {null}
     */
    function turnPages(manifest) {
      var newTime = Date.now();
      var canRun = true;
      $.each(manifest, function (i, obj) {
        if (newTime - currentTime > obj.time && !obj.hasFired) {
          data.heidelberg.turnPage(obj.pageIndex);
          // This ensures that the event is only fired for the last page turn
          if (i === manifest.length - 2) {
            fireEvent = true;
          }
          // If we're on the final page, we want to cancel the animation frame so it's not running constantly,
          // which could cause issues when trying to run this function again if you turn pages more than once.
          if (i === manifest.length - 1) {
            canRun = false;
            cancelAnimationFrame(data.drawPage);
          }
          obj.hasFired = true;
        }
      });
      if (canRun) {
        data.drawPage = requestAnimationFrame(turnPages.bind(this, manifest));
      }
    }

    turnPages(indexObject);
  };
};
