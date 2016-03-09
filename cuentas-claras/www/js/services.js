var app = angular.module('starter.services', [])
  .factory('invitadosService', function () {

    var invitados = [];
    var invitadoSeleccionado;

    return {
      add: function (Invitado) {
        if (!this.get(Invitado)) {
          invitados.push(Invitado);
        }
      },
      getSeleccionado: function () {
        return invitadoSeleccionado;
      },
      seleccionar: function (invitado) {
        invitadoSeleccionado = invitado;
      },
      getAll: function () {
        return invitados;
      },
      remove: function (invitado) {
        invitados.splice(invitados.indexOf(invitado), 1);
      },

      contarRegistradosEnCategoria: function(cat){
        var count = 0;
        invitados.forEach(function(e,i,a){
          if(e.tieneCategoria(cat)){
            count++;
          }
        });
        return count;
      },
      getTotalAportado: function(){
        var total = 0;
        invitados.forEach(function(e,i,a){
          total += e.aFavor;
        });
        return total;
      },
      get: function (invitado) {
        for (var i = 0; i < invitados.length; i++) {
          if (invitados[i].nombre == invitado.nombre) {
            return invitados[i];
          }
        }
        return null;
      }
    };
  })
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
      getTotalGastos: function(){
        var total =0;
        categorias.forEach(function(e,i,a){
          total +=e.getTotal();
        })
        return total;
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


