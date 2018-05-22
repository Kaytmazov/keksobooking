'use strict';

(function () {
  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');

  var AdPhoto = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var adTypeMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var makeFeatureElement = function (item) {
    var featureElement = document.createElement('li');

    featureElement.classList.add('popup__feature');
    featureElement.classList.add('popup__feature--' + item);

    return featureElement;
  };

  var makePhotoElement = function (item) {
    var photoElement = document.createElement('img');
    photoElement.src = item;
    photoElement.width = AdPhoto.WIDTH;
    photoElement.height = AdPhoto.HEIGHT;
    photoElement.classList.add('popup__photo');
    photoElement.alt = 'Фотография жилья';
    return photoElement;
  };

  // Создаем элемент объявления
  var makeCardElement = function (ad) {
    var cardElement = cardTemplate.cloneNode(true);
    var popupFeatures = cardElement.querySelector('.popup__features');
    var popupDescription = cardElement.querySelector('.popup__description');
    var popupPhotos = cardElement.querySelector('.popup__photos');
    var popupClose = cardElement.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      window.map.closeCard();
    });

    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = adTypeMap[ad.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    if (ad.offer.features.length !== 0) {
      window.util.removeChilds(popupFeatures);
      popupFeatures.appendChild(window.util.createCollectionFromArray(ad.offer.features, makeFeatureElement));
    } else {
      popupFeatures.remove();
    }

    if (ad.offer.description) {
      popupDescription.textContent = ad.offer.description;
    } else {
      popupDescription.remove();
    }

    if (ad.offer.photos.length !== 0) {
      window.util.removeChilds(popupPhotos);
      popupPhotos.appendChild(window.util.createCollectionFromArray(ad.offer.photos, makePhotoElement));
    } else {
      popupPhotos.remove();
    }

    return cardElement;
  };

  window.card = {
    makeElement: makeCardElement
  };
})();
