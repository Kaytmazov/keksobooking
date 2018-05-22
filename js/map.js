'use strict';

(function () {
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_MAIN_START_X = 570;
  var PIN_MAIN_START_Y = 375;
  var PIN_ARROW_HEIGHT = 22;
  var LOCATION_X_MIN = 0;
  var LOCATION_X_MAX = 1200;
  var LOCATION_Y_MIN = 150;
  var LOCATION_Y_MAX = 500;
  var ESC_KEYCODE = 27;
  var ENABLE_FORM_FIELDS = false;
  var DISABLE_FORM_FIELDS = true;
  var PINS_AMOUNT = -5;
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var avatarField = adForm.querySelector('#avatar');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomNumberField = adForm.querySelector('#room_number');
  var imagesField = adForm.querySelector('#images');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var submitButton = adForm.querySelector('.ad-form__submit');
  var pageState = 'disabled';

  // При успешном запросе
  var onLoad = function (data) {
    window.ads = data;
    var slicedAds = window.ads.slice(PINS_AMOUNT);
    mapPinsContainer.append(window.pin.render(slicedAds));
  };

  // Функция переключения состояния страницы
  var enablePageState = function () {
    window.backend.load(onLoad, window.error, LOAD_URL);
    window.form.setAddressFieldValue('dragged');

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    mapFilters.addEventListener('change', window.filter.onFieldChange);
    avatarField.addEventListener('change', window.form.onAvatarChange);
    typeField.addEventListener('change', window.form.onTypeFieldChange);
    timeInField.addEventListener('change', window.form.onTimeInFieldChange);
    timeOutField.addEventListener('change', window.form.onTimeOutFieldChange);
    roomNumberField.addEventListener('change', window.form.onRoomNumberFieldChange);
    imagesField.addEventListener('change', window.form.onImagesFieldChange);
    resetButton.addEventListener('click', window.form.onResetButtonClick);
    submitButton.addEventListener('click', window.form.onSubmitButtonClick);
    adForm.addEventListener('submit', window.form.onSubmit);
    window.util.changeFormFieldsState(ENABLE_FORM_FIELDS, adForm);
    window.util.changeFormFieldsState(ENABLE_FORM_FIELDS, mapFilters);
    pageState = 'enagled';
  };

  // Закрытие карточки при нажатии кнопки ESC
  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.map.closeCard();
    }
  };

  // Функция отрисовки объявления
  var renderCard = function (ad) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.makeElement(ad));

    return fragment;
  };

  // Активация карты при перемещении метки
  var onMainPinDrag = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentPinX = mapPinMain.offsetLeft - shift.x;
      var currentPinY = mapPinMain.offsetTop - shift.y;

      var isAvialibleX = currentPinX + (PIN_MAIN_WIDTH / 2) > LOCATION_X_MIN && currentPinX + (PIN_MAIN_WIDTH / 2) < LOCATION_X_MAX;
      var isAvialibleY = currentPinY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT > LOCATION_Y_MIN && currentPinY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT < LOCATION_Y_MAX;

      if (isAvialibleX) {
        mapPinMain.style.left = currentPinX + 'px';
      }

      if (isAvialibleY) {
        mapPinMain.style.top = currentPinY + 'px';
      }
      window.form.setAddressFieldValue('dragged');
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (pageState === 'disabled') {
        enablePageState();
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMainPinDrag);

  window.map = {
    disablePageState: function () {
      var openedCard = map.querySelector('.map__card');

      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      adForm.reset();

      mapPinMain.style.left = PIN_MAIN_START_X + 'px';
      mapPinMain.style.top = PIN_MAIN_START_Y + 'px';
      window.pin.remove();

      if (openedCard) {
        openedCard.remove();
      }

      window.util.changeFormFieldsState(DISABLE_FORM_FIELDS, adForm);
      window.util.changeFormFieldsState(DISABLE_FORM_FIELDS, mapFilters);
      window.form.setAddressFieldValue();
      mapFilters.removeEventListener('change', window.filter.onFieldChange);
      avatarField.removeEventListener('change', window.form.onAvatarChange);
      typeField.removeEventListener('change', window.form.onTypeFieldChange);
      window.form.setPriceFieldValue();
      timeInField.removeEventListener('change', window.form.onTimeInFieldChange);
      timeOutField.removeEventListener('change', window.form.onTimeOutFieldChange);
      roomNumberField.removeEventListener('change', window.form.onRoomNumberFieldChange);
      imagesField.removeEventListener('change', window.form.onImagesFieldChange);
      resetButton.removeEventListener('click', window.form.onResetButtonClick);
      submitButton.removeEventListener('click', window.form.onSubmitButtonClick);
      adForm.removeEventListener('submit', window.form.onSubmit);
      pageState = 'disabled';
    },
    openCard: function (ad) {
      map.insertBefore(renderCard(ad), map.querySelector('.map__filters-container'));
      document.addEventListener('keydown', onCardEscPress);
    },
    closeCard: function () {
      map.querySelector('.map__card').remove();
      var currentPin = map.querySelector('.map__pin--active');
      currentPin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', onCardEscPress);
    }
  };
})();
