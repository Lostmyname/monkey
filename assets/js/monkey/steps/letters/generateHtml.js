'use strict';

module.exports = function () {
  return function (data) {
    data.letters = data.html.parents('[data-key="lmn-book"]')
      .find('[data-key="monkey-letters"]');
    return data;
  };
};
