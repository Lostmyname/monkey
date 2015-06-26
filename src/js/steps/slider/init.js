export default function ($events) {
  return function (data) {
    if (!data.sliderElement) {
      return data;
    }

    var $slider = data.sliderElement.find('input');
    var letters = data.letters.length;
    var sliderActive = false;

    $events.on('letterChange', function (e, page) {
      if (sliderActive) {
        return;
      }
      $slider.val(200 * page / letters);
    });

    $slider.on('mousedown', () => sliderActive = true);

    $slider.on('mouseup', function () {
      setTimeout(() => sliderActive = false, 2000);
    });

    $slider.on('input', function () {
      data.turnToPage(Math.round(letters * $slider.val() / 400));
    });

    return data;
  };
}
