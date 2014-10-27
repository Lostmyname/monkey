var widget = (function () {
  'use strict';
  
  var urls = {
    images: '//lostmycdn.imgix.net/widget/{{ gender }}/{{ url }}?w=970&amp;dpr=2&amp;q=60',
    spread: '//lostmynameproduction.s3.amazonaws.com/assets/name_spreads/' +
      '{{ locale }}/{{ gender }}/{{ name }}/spread.jpg?w=970',
    bookTip: 'assets/images/book_tip.png'
  };

  var widget = {};

  widget.init = function () {
    return widget._getData()
      .then(widget._generateUrls)
      .then(widget._generateHtml);
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
  widget._getData = function () {
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
   *
   * @param {object} data
   * @returns {object} data Original object with a new urls property.
   */
  widget._generateUrls = function (data) {
    data.urls = $.map(data.letters, function (letterData) {
      var url = {
        special: urls.images,
        story: urls.images,
        spread: urls.spread
      }[letterData.type];

      return handleReplace(url, {
        gender: data.gender,
        locale: data.locale,
        name: data.name,
        url: letterData.url
      });
    });

    return data;
  };

  /**
   * Generate HTML for pages from list of URLs.
   *
   * @todo: Templating?
   * @param {object} data
   * @returns {object} data Original object with a new html property.
   */
  widget._generateHtml = function (data) {
    data.html = $('<div />').addClass('widget');
    var $images = $('<div />').appendTo(data.html)
      .addClass('landscape-images');
    var $inner = $('<div />').appendTo($images)
      .addClass('landscape-images-inner');
    
    $.each(data.urls, function (i, url) {
      var $page = $('<div />').appendTo($inner).addClass('page');

      if (i === 0) {
        $('<div />').appendTo($page)
          .addClass('heidelberg-tapToOpen')
          .append($('<img />').attr('img', urls.bookTip));
      }

      $('<img />').appendTo($page).attr('src', url);
    });

    return data;
  };

  /**
   * Templating sort of? Takes a string and an object and makes replacements.
   *
   * IF replacements is {foo: 'bar'}, `{{ foo }}` will be replaced with `bar`.
   *
   * @param {string} string
   * @param {object} replacements
   * @returns {string} The string with replacements made.
   */
  function handleReplace(string, replacements) {
    return string.replace(/\{\{\s*([a-z]+)\s*\}\}/g, function (full, item) {
      return replacements.hasOwnProperty(item) ? replacements[item] : full;
    });
  }

  widget.helpers = {};
  widget.helpers.handleReplace = handleReplace;

  return widget;
})();
