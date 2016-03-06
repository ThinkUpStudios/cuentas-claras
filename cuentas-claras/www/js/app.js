// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'ionic-material','ngToast', 'starter.controllers', 'starter.services', 'ionMdInput'])

  .run(function ($ionicPlatform) {
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
  .config(['ngToastProvider', function(ngToast) {
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

app.factory('Categoria',function(){

  function Categoria(p_nombre,p_cantidad,p_precio){
    this.nombre = p_nombre;
    this.precioUnitario =p_precio;
    this.cantidad = p_cantidad;
  }

  Categoria.prototype ={
   nombre: '',
    precioUnitario:'',
    canitdad:'',
    getTotal: function() {
      return this.precioUnitario * this.cantidad;
    }
  };
    return(Categoria);
});


