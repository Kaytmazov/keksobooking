'use strict';

(function () {
  window.util = {
    // Функция удаления дочерных элементов
    removeChilds: function (parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    },
    createCollectionFromArray: function (array, renderFunction) {
      var fragment = document.createDocumentFragment();

      array.forEach(function (it) {
        fragment.appendChild(renderFunction(it));
      });

      return fragment;
    },
    // Функция включения / отключения полей формы
    changeFormFieldsState: function (value, form) {
      var fields = form.children;

      Array.from(fields).forEach(function (it) {
        it.disabled = value;
      });
    }
  };
})();
