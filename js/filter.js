'use strict';

(function () {
  var PINS_AMOUNT = -5;

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');

  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var updatePins = function () {
    if (map.querySelector('.map__card')) {
      window.map.closeCard();
    }
    window.pin.remove();

    var filteredPins = window.ads.filter(function (it) {
      return getType(it) && getPrice(it) && getRooms(it) && getCapacity(it) && getFeatures(it);
    }).slice(PINS_AMOUNT);

    mapPinsContainer.append(window.pin.render(filteredPins));
  };

  var getType = function (ad) {
    if (housingType.value === 'any') {
      return true;
    }
    return housingType.value === ad.offer.type;
  };

  var getPrice = function (ad) {
    switch (housingPrice.value) {
      case 'low':
        return Price.LOW > ad.offer.price;
      case 'middle':
        return Price.LOW <= ad.offer.price && Price.HIGH > ad.offer.price;
      case 'high':
        return Price.HIGH <= ad.offer.price;
      default:
        return true;
    }
  };

  var getRooms = function (ad) {
    if (housingRooms.value === 'any') {
      return true;
    }
    return parseInt(housingRooms.value, 10) === ad.offer.rooms;
  };

  var getCapacity = function (ad) {
    if (housingGuests.value === 'any') {
      return true;
    }
    return parseInt(housingGuests.value, 10) === ad.offer.guests;
  };

  var getFeatures = function (ad) {
    var checkedFeatures = mapFilters.querySelectorAll('input[type=checkbox]:checked');

    return Array.from(checkedFeatures).every(function (it) {
      return ad.offer.features.indexOf(it.value) !== -1;
    });
  };

  window.filter = {
    onFieldChange: function () {
      window.debounce(updatePins);
    }
  };
})();
