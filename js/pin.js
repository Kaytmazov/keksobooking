'use strict';

(function () {
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  // Создание элемента метки
  var makePinElement = function (ad) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinAvatar = pinElement.querySelector('img');

    pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
    pinElement.style.top = ad.location.y - PIN_HEIGHT + 'px';
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;

    pinElement.addEventListener('click', function () {
      if (map.querySelector('.map__card')) {
        window.map.closeCard();
      }
      window.map.openCard(ad);
      pinElement.classList.add('map__pin--active');
    });

    return pinElement;
  };

  // Функция удаления отрисованных меток
  var removePins = function () {
    var pins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pin) {
      pin.remove();
    });
  };

  window.pin = {
    // Функция вычисления координат главной метки
    calculateMainPinCoords: function (pinState) {
      var cordX = mapPinMain.offsetLeft + (PIN_MAIN_WIDTH / 2);
      var cordY = mapPinMain.offsetTop + (PIN_MAIN_HEIGHT / 2);

      if (pinState === 'dragged') {
        cordY = mapPinMain.offsetTop + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT;
      }

      return cordX + ', ' + cordY;
    },
    // Функция отрисовки меток объявлений
    render: function (ads) {
      var fragment = document.createDocumentFragment();

      ads.forEach(function (it) {
        fragment.appendChild(makePinElement(it));
      });

      return fragment;
    },
    remove: removePins
  };
})();
