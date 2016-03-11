var app = angular.module('starter.services', [])

  .factory('$localstorage', ['$window', function ($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },

    }
  }])


  .factory('invitadosService', ['$localstorage', '$rootScope','Invitado', 'Categoria', function ($localstorage, $rootScope, Invitado, Categoria ) {
    var invitadosContent = {
      invitados: [],
      invitadoSeleccionado: new Invitado("")
    };
    var data = $localstorage.getObject("invitadosContent");
    if (!data.invitados) {
      $localstorage.setObject("invitadosContent", invitadosContent);
    } else {

      data.invitados.forEach(function (e, i, a) {
        e.__proto__ = Invitado.prototype;
        e.categorias.forEach(function (ee, ii, aa) {
          ee.__proto__ = Categoria.prototype;
        })
        invitadosContent.invitados.push(e);
      });
      invitadosContent.invitadoSeleccionado = data.invitadoSeleccionado;
      invitadosContent.invitadoSeleccionado.__proto__ = Invitado.prototype;

    }
    $rootScope.$on("nuevoEvento", function(){
      invitadosContent = {
        invitados: [],
        invitadoSeleccionado: new Invitado("")
      };
      $localstorage.setObject("invitadosContent", invitadosContent);
    });
    return {
      add: function (Invitado) {

        if (invitadosContent && !this.get(Invitado)) {
          invitadosContent.invitados.push(Invitado);
          this.save();
        }
      },
      getSeleccionado: function () {
        return invitadosContent.invitadoSeleccionado;
      },
      seleccionar: function (invitado) {

        invitadosContent.invitadoSeleccionado = invitado;
        this.save();
      },
      getAll: function () {
        return invitadosContent.invitados;
      },
      remove: function (invitado) {
        this.getAll().splice(this.getAll().indexOf(invitado), 1);
        this.save();
      },
      save: function () {
        $localstorage.setObject("invitadosContent", invitadosContent);
      },
      contarRegistradosEnCategoria: function (cat) {
        var count = 0;
        this.getAll().forEach(function (e, i, a) {
          if (e.tieneCategoria(cat)) {
            count++;
          }
        });
        return count;
      },
      getTotalAportado: function () {
        var total = 0;
        this.getAll().forEach(function (e, i, a) {
          total += e.aFavor;
        });
        return total;
      },
      get: function (invitado) {

        this.getAll().forEach(function (e, i, a) {
          if (e.nombre == invitado.nombre) {
            return e;
          }
        });
        return null;
      }
    };
  }])
  .factory('categoriasService', ['$localstorage','$rootScope', 'Categoria', function ($localstorage, $rootScope, Categoria ) {

    var categoriasContent = {
      categorias: [],
      categoriaSeleccionada: new Categoria("", 0)
    };

    var data = $localstorage.getObject("catContent")
    if (!data.categorias) {
      $localstorage.setObject("catContent", categoriasContent);
    } else {
      data.categorias.forEach(function (e, i, a) {
        e.__proto__ = Categoria.prototype;
        categoriasContent.categorias.push(e);
      })
      categoriasContent.categoriaSeleccionada = data.categoriaSeleccionada;
      categoriasContent.categoriaSeleccionada.__proto__ = Categoria.prototype;
    }
    $rootScope.$on("nuevoEvento", function(){
      categoriasContent = {
        categorias: [],
        categoriaSeleccionada: new Categoria("", 0)
      };
      $localstorage.setObject("catContent", categoriasContent);
    });
    return {
      add: function (Categoria) {
        if (!this.get(Categoria)) {
          categoriasContent.categorias.push(Categoria);
          this.save();
        }
      },
      getSeleccionada: function () {
        return categoriasContent.categoriaSeleccionada;
      },
      seleccionar: function (categoria) {
        categoriasContent.categoriaSeleccionada = categoria;
        this.save();
      },
      getAll: function () {
        return categoriasContent.categorias;
      },
      remove: function (Categoria) {
        categoriasContent.categorias.splice(categoriasContent.categorias.indexOf(Categoria), 1);
        this.save();
      },
      getTotalGastos: function () {
        var total = 0;
        categoriasContent.categorias.forEach(function (e, i, a) {
          total += e.getTotal();
        })
        return total;
      },
      save: function () {
        $localstorage.setObject("catContent", categoriasContent);
      },
      get: function (Categoria) {
        for (var i = 0; i < categoriasContent.categorias.length; i++) {
          if (categoriasContent.categorias[i].nombre == Categoria.nombre) {
            return categoriasContent.categorias[i];
          }
        }
        return null;
      }
    };
  }]);


