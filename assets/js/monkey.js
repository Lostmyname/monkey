window.monkey = module.exports = (function () {
  'use strict';

  var urls = {
    images: '//lostmycdn.imgix.net/widget/{{ gender }}/{{ url }}?w=970&amp;dpr=2&amp;q=60',
    spread: '//lostmynameproduction.s3.amazonaws.com/assets/name_spreads/' +
      '{{ locale }}/{{ gender }}/{{ name }}/spread.jpg?w=970',
    bookTip: 'assets/images/book_tip.png'
  };

  var monkey = {};

  /**
   * Initiate monkey; generate it, and then insert it into the page.
   *
   * @param {string|HTMLElement|jQuery} monkeyContainer Container for monkey.
   * @returns A promise that will be resolved when monkey is ready.
   */
  monkey.init = function (monkeyContainer) {
    return monkey._getData()
      .then(monkey._generateUrls())
      .then(monkey._generateHtml())
      .then(monkey._insertHtml(monkeyContainer));
  };

  /**
   * Gets the data from the server (or fakes it, for now).
   *
   * This comment definitely won't be wrong one day. I'll definitely remember
   * to update it.
   *
   * @returns {object} (via promise) Object with a number of properties such as
   *                   name and gender, and then a letters property containing
   *                   information on the pages. Seriously, just use a debugger.
   */
  monkey._getData = function () {
    var defer = $.Deferred();

    setTimeout(function () {
      defer.resolve({
        name: 'HEIDELBERG',
        gender: 'girl',
        locale: 'en-GB',
        letters: [
          { type: 'special', url: 'Front.jpg' },
          { type: 'special', url: 'Intro_01.jpg' },
          { type: 'special', url: 'Intro_02.jpg' },
          { type: 'story', letter: 'H', part: 1, url: 'primary/Hippo_01.jpg' },
          { type: 'story', letter: 'H', part: 2, url: 'primary/Hippo_02.jpg' },
          { type: 'story', letter: 'E', part: 1, url: 'primary/Elephant_01.jpg' },
          { type: 'story', letter: 'E', part: 2, url: 'primary/Elephant_02.jpg' },
          { type: 'story', letter: 'I', part: 1, url: 'primary/Inuit_01.jpg' },
          { type: 'story', letter: 'I', part: 2, url: 'primary/Inuit_02.jpg' },
          { type: 'story', letter: 'D', part: 1, url: 'primary/Dragon_01.jpg' },
          { type: 'story', letter: 'D', part: 2, url: 'primary/Dragon_02.jpg' },
          { type: 'story', letter: 'E', part: 1, url: 'primary/Eagle_01.jpg' },
          { type: 'story', letter: 'E', part: 2, url: 'primary/Eagle_02.jpg' },
          { type: 'story', letter: 'L', part: 1, url: 'primary/Lion_01.jpg' },
          { type: 'story', letter: 'L', part: 2, url: 'primary/Lion_02.jpg' },
          { type: 'story', letter: 'B', part: 1, url: 'primary/Bear_01.jpg' },
          { type: 'story', letter: 'B', part: 2, url: 'primary/Bear_02.jpg' },
          { type: 'story', letter: 'E', part: 1, url: 'helpers/Helper_Hole_01.jpg' },
          { type: 'story', letter: 'E', part: 2, url: 'helpers/Helper_Hole_E.jpg' },
          { type: 'story', letter: 'R', part: 1, url: 'primary/Robot_01.jpg' },
          { type: 'story', letter: 'R', part: 2, url: 'primary/Robot_02.jpg' },
          { type: 'story', letter: 'G', part: 1, url: 'primary/Giant_01.jpg' },
          { type: 'story', letter: 'G', part: 2, url: 'primary/Giant_02.jpg' },
          { type: 'special', url: 'Outro_01.jpg' },
          { type: 'spread' },
          { type: 'special', url: 'Back.jpg' }
        ]
      });
    }, 10);

    return defer.promise();
  };

  /**
   * Takes data and turns letters into URLs.
   */
  monkey._generateUrls = function () {
    return function (data) {
      data.urls = $.map(data.letters, function (letterData) {
        var url = {
          special: urls.images,
          story: urls.images,
          spread: urls.spread
        }[letterData.type];

        return monkey.helpers.handleReplace(url, {
          gender: data.gender,
          locale: data.locale,
          name: data.name,
          url: letterData.url
        });
      });

      return data;
    };
  };

  /**
   * Generate HTML for pages from list of URLs.
   *
   * Varies depending on the browser.
   *
   * @todo: Templating?
   */
  monkey._generateHtml = function () {
    if (monkey.helpers.isMobile()) {
      return monkey._generateHtml.mobile;
    } else {
      return monkey._generateHtml.desktop;
    }
  };

  monkey._generateHtml.mobile = function (data) {
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
          .append($('<img />').attr('src', urls.bookTip));
      }

      $('<img />').appendTo($page).attr('src', url);
    });

    mobileSetup($monkey);

    return data;
  };

  // @todo: Use heidelberg
  monkey._generateHtml.desktop = function (data) {
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
          .append($('<img />').attr('src', urls.bookTip));
      }

      $('<img />').appendTo($page).attr('src', url);
    });

    return data;
  };

  function mobileSetup($monkey) {
    var portrait;
    var windowLeft = 0;

    $(window).on('orientationchange resize', function () {
      portrait = (window.innerHeight > window.innerWidth);

      // Make images 100% high. Temporary hack, should use CSS.
      var height = portrait ? 'auto' : $(window).height();
      $('.landscape-images .page img').css('height', height);

      $('.monkey, body').removeClass('landscape portrait')
        .addClass(portrait ? 'portrait' : 'landscape');

      $monkey.scrollLeft($monkey.find('img').width() * windowLeft);
    });
    $(window).triggerHandler('resize');

    $monkey.on('scroll', function () {
      windowLeft = $monkey.scrollLeft() / $monkey.find('img').width();
    });
  }

  /**
   * Inserts HTML into specified container.
   *
   * @param {string|HTMLElement|jQuery} monkeyContainer The container.
   */
  monkey._insertHtml = function (monkeyContainer) {
    var $container = $(monkeyContainer);

    return function (data) {
      $container.append(data.html);

      data.container = $container;

      return data;
    };
  };

  monkey.helpers = {};

  /**
   * Templating sort of? Takes a string and an object and makes replacements.
   *
   * IF replacements is {foo: 'bar'}, `{{ foo }}` will be replaced with `bar`.
   *
   * @param {string} string
   * @param {object} replacements
   * @returns {string} The string with replacements made.
   */
  monkey.helpers.handleReplace = function (string, replacements) {
    return string.replace(/\{\{\s*([a-z]+)\s*\}\}/g, function (full, item) {
      return replacements.hasOwnProperty(item) ? replacements[item] : full;
    });
  };

  /**
   * Returns whether browser is a mobile or not. Tests for touch support and
   * screen width.
   *
   * @returns {boolean} True if mobile.
   */
  monkey.helpers.isMobile = function () {
    // If doesn't support touch
    if (!('ontouchstart' in window) && !navigator.msMaxTouchPoints) {
      return false;
    }

    if (!window.matchMedia) {
      return false;
    }

    // @todo: Work out an actual good width
    return window.matchMedia('(max-width: 800px)').matches;
  };

  return monkey;
})();
