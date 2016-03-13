// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'ionic-material', 'ngToast', 'starter.controllers', 'starter.services', 'ionMdInput'])

  .run(function ($ionicPlatform, $state, $timeout, invitadosService, categoriasService) {

  })

  .run(function ($ionicPlatform, invitadosService,categoriasService, $rootScope) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      document.addEventListener("deviceready", function(event){
        document.addEventListener("pause", function(event){
          invitadosService.save();
          categoriasService.save();
          console.log('PAUSA!!!');
        });

      }, false);


    });
  })
  .directive('selectOnClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var focusedElement;
        element.on('click', function () {
          if (focusedElement != this) {
            this.select();
            focusedElement = this;
          } else {
            this.select(false);
          }
        });
        element.on('blur', function () {
          focusedElement = null;
        });
      }
    };
  })
  .config(['ngToastProvider', function (ngToast) {
    ngToast.configure({
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }])
  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js


    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/sideMenu.html',
      controller: 'AppCtrl'
    })
      .state('app.detalleCategoria', {
        url: '/detalleCategoria',
        views: {
          'menuContent': {
            templateUrl: 'templates/detalleCategoria.html',
            controller: 'DetalleCategoriaCtrl'
          }
        }
      })
      .state('app.nuevaCategoria', {
        url: '/nuevaCategoria',
        views: {
          'menuContent': {
            templateUrl: 'templates/nuevaCategoria.html',
            controller: 'NuevaCategoriaCtrl'
          }

        }
      })
      .state('app.invitados', {
        url: '/invitados',
        views: {
          'menuContent': {
            templateUrl: 'templates/invitados.html',
            controller: 'InvitadosCtrl'
          }

        }
      })
      .state('app.nuevoInvitado', {
        url: '/nuevoInvitado',
        views: {
          'menuContent': {
            templateUrl: 'templates/nuevoInvitado.html',
            controller: 'NuevoInvitadoCtrl'
          }

        }
      })
      .state('app.categorias', {
        url: '/categorias',
        views: {
          'menuContent': {
            templateUrl: 'templates/categorias.html',
            controller: 'CategoriasCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categorias');

  });

app.factory('Categoria', function () {

  function Categoria(p_nombre, p_precio) {
    this.nombre = p_nombre;
    this.precioUnitario = p_precio;
  }

  Categoria.prototype = {
    nombre: '',
    precioUnitario: 0,
    getTotal: function () {
      return this.precioUnitario;
    }
  };
  return (Categoria);
});

app.factory('Invitado', function () {

  function Invitado(p_nombre, p_aFavor) {
    this.nombre = p_nombre;
    this.categorias = [];
    this.aFavor = p_aFavor;
  }

  Invitado.prototype = {
    nombre: '',
    categorias: [],
    aFavor: 0,
    agregarCategoria: function (categoria) {
      if (this.categorias.indexOf(categoria) == -1) {
        this.categorias.push(categoria);
      }
    },
    quitarCategoria: function (categoria) {
      if (this.tieneCategoria(categoria)) {
        this.categorias.splice(this.categorias.indexOf(categoria), 1);
      }
    },
    tieneCategoria: function (categoria) {
      return this.categorias.indexOf(categoria) > -1;
    }

  };
  return (Invitado);
});
