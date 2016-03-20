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


  .factory('invitadosService', ['$localstorage', '$rootScope', 'Invitado', 'Categoria', 'categoriasService', function ($localstorage, $rootScope, Invitado, Categoria, categoriasService) {
    var invitadosContent = {
      invitados: [],
      invitadoSeleccionado: new Invitado("", null)
    }
    var data = $localstorage.getObject("invitadosContent");
    if (!data.invitados) {
      $localstorage.setObject("invitadosContent", invitadosContent);
    } else {
      var inv = null;
      data.invitados.forEach(function (e, i, a) {
        inv = new Invitado(e.nombre, e.aFavor);
        e.categorias.forEach(function (ee, ii, aa) {
          inv.agregarCategoria(categoriasService.get(ee));
        });
        invitadosContent.invitados.push(inv);
      });
      invitadosContent.invitados.forEach(function (e, i, a) {
        if (e.nombre == data.invitadoSeleccionado.nombre) {
          invitadosContent.invitadoSeleccionado = e;
        }
      });


    }
    $rootScope.$on("nuevoEvento", function () {
      invitadosContent = {
        invitados: [],
        invitadoSeleccionado: new Invitado("")
      };
      $localstorage.setObject("invitadosContent", invitadosContent);
    });
    return {
      existe: function (inv) {
        return invitadosContent.invitados.filter(function (e, i, a) {
            return e.nombre == inv.nombre
          })[0] != undefined;
      },
      add: function (Invitado) {

        if (invitadosContent && !this.existe(Invitado)) {
          invitadosContent.invitados.unshift(Invitado);
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
      quitarCategoria: function(cat){
        invitadosContent.invitados.forEach(function(inv,i,a){
          if(inv.tieneCategoria(cat))inv.quitarCategoria(cat);
        });
        if(invitadosContent.invitadoSeleccionado.tieneCategoria(cat)){
          invitadosContent.invitadoSeleccionado.quitarCategoria(cat);
        }
      },
      remove: function (invitado) {
        this.getAll().splice(this.getAll().indexOf(invitado), 1);
        this.save();
      },
      save: function () {
        $localstorage.setObject("invitadosContent", invitadosContent);
      },
      agregarCategoria: function(cat){

        invitadosContent.invitados.forEach(function(e,i,a){
          e.agregarCategoria(cat);
        });
        this.save();

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
      eliminarCategoria: function (cat) {
        invitadosContent.invitados.forEach(function (e, i, a) {
          e.quitarCategoria(cat);
        });
      },
      get: function (invitado) {
        return invitadosContent.invitados.filter(function (e, i, a) {
          return e.nombre == Invitado.nombre
        })[0];
      }
    };
  }])
  .factory('categoriasService', ['$localstorage', '$rootScope', 'Categoria', function ($localstorage, $rootScope, Categoria) {

    var categoriasContent = {
      categorias: [],
      categoriaSeleccionada: new Categoria("", 0)
    };

    var data = $localstorage.getObject("catContent")
    if (!data.categorias) {
      $localstorage.setObject("catContent", categoriasContent);
    } else {
      data.categorias.forEach(function (e, i, a) {
        categoriasContent.categorias.push(new Categoria(e.nombre, e.precioUnitario));
      });
      categoriasContent.categoriaSeleccionada =
        new Categoria(data.categoriaSeleccionada.nombre, data.categoriaSeleccionada.precioUnitario);

    }
    $rootScope.$on("nuevoEvento", function () {
      categoriasContent = {
        categorias: [],
        categoriaSeleccionada: new Categoria("", 0)
      };
      $localstorage.setObject("catContent", categoriasContent);
    });
    return {
      existe: function (Categoria) {
        return categoriasContent.categorias.filter(function (e, i, a) {
            return e.nombre == Categoria.nombre
          })[0] != undefined;
      },
      add: function (Categoria) {
        if (categoriasContent && !this.existe(Categoria)) {
          categoriasContent.categorias.unshift(Categoria);
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
        return categoriasContent.categorias.filter(function (e, i, a) {
          return e.nombre == Categoria.nombre
        })[0];
      }
    };
  }]);


app.factory('focus', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  }
});