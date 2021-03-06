// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'ngToast', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform, $state, $timeout, invitadosService, categoriasService) {

  })

  .run(function ($ionicPlatform, invitadosService, categoriasService, $rootScope) {
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

      document.addEventListener("deviceready", function (event) {
        document.addEventListener("pause", function (event) {
          invitadosService.save();
          categoriasService.save();
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

      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        controller: 'AppCtrl'

      })

      .state('tab.invitados', {
        url: '/invitados',
        views: {
          'invitados-tab': {
            templateUrl: 'templates/invitados.html',
            controller: 'InvitadosCtrl'
          }

        }
      })
      .state('tab.categorias', {
        url: '/categorias',
        views: {
          'categorias-tab': {
            templateUrl: 'templates/categorias.html',
            controller: 'CategoriasCtrl'
          }
        }
      })
      .state('tab.nuevaCategoria', {
        url: '/nuevaCategoria',
        views: {
          'categorias-tab': {
            templateUrl: 'templates/nuevaCategoria.html',
            controller: 'NuevaCategoriaCtrl'
          }

        }
      })

      .state('nuevoInvitado', {
        url: '/nuevoInvitado',
        templateUrl: 'templates/nuevoInvitado.html',
        cache: false

      })
      .state('editarCategoria', {
        url: '/editarCategoria',
        templateUrl: 'templates/editarCategoria.html',
        cache: false

      })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/categorias');

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

app.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) {
          //console.log('trigger',value);
          //$timeout(function() {
          element[0].focus();
          scope.trigger = false;
          //});
        }
      });
    }
  };
});