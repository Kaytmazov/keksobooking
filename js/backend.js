'use strict';

(function () {
  var TIMEOUT = 10000;

  var StatusCode = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    ACCESS_DENIED: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    APPLICATION_ERROR: 503,
  };

  var makeXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          onLoad(xhr.response);
          break;
        case StatusCode.BAD_REQUEST:
          onError('Статус ответа: ' + xhr.status, 'В запросе ошибка.');
          break;
        case StatusCode.ACCESS_DENIED:
          onError('Статус ответа: ' + xhr.status, 'Доступ запрещён. У вас недостаточно прав.');
          break;
        case StatusCode.NOT_FOUND:
          onError('Статус ответа: ' + xhr.status, 'Данные по запросу не найдены.');
          break;
        case StatusCode.SERVER_ERROR:
          onError('Статус ответа: ' + xhr.status, 'Внутренняя ошибка сервера');
          break;
        case StatusCode.APPLICATION_ERROR:
          onError('Статус ответа: ' + xhr.status, 'Сервис временно недоступен');
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка', 'Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Ошибка', 'Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError, url) {
      var xhr = makeXHR(onLoad, onError, url);
      xhr.open('GET', url);
      xhr.send();
    },
    save: function (data, onLoad, onError, url) {
      var xhr = makeXHR(onLoad, onError, url);
      xhr.open('POST', url);
      xhr.send(data);
    }
  };
})();
