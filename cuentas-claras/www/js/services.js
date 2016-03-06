var app = angular.module('starter.services', [])

  .factory('categoriasService', function () {

    var categorias = [];
    var categoriaSeleccionada;

    return {
      add: function (Categoria) {
        if (!this.get(Categoria)) {
          categorias.push(Categoria);
        }
      },
      getSeleccionada: function () {
        return categoriaSeleccionada;
      },
      seleccionar: function (categoria) {
        categoriaSeleccionada = categoria;
      },
      getAll: function () {
        return categorias;
      },
      remove: function (Categoria) {
        categorias.splice(categorias.indexOf(Categoria), 1);
      },
      get: function (Categoria) {
        for (var i = 0; i < categorias.length; i++) {
          if (categorias[i].nombre == Categoria.nombre) {
            return categorias[i];
          }
        }
        return null;
      }
    };
  });


