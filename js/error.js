'use strict';

(function () {
  var ALERT_CLOSE_TIMER = 5000;

  var template = document.querySelector('template');
  var errorTemplate = template.content.querySelector('.error').cloneNode(true);

  window.error = function (title, text) {
    errorTemplate.querySelector('.error__title').textContent = title;
    errorTemplate.querySelector('.error__text').textContent = text;

    document.body.insertAdjacentElement('afterbegin', errorTemplate);

    var alert = document.querySelector('.error');
    var removeAlert = function () {
      alert.remove();
    };
    setTimeout(removeAlert, ALERT_CLOSE_TIMER);
  };
})();

