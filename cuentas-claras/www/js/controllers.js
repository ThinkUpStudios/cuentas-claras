angular.module('starter.controllers', [])

  .run(function ($rootScope, $cordovaSocialSharing, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/menu.html', {
      scope: $rootScope,
    }).then(function (popover) {
      $rootScope.popover = popover;
    });

    $rootScope.irAStore = function () {
      window.open('market://details?id=', '_system');
    };
    $rootScope.shareAnywhere = function () {
      $cordovaSocialSharing.share("Cuentas Claras", "Cuentas Claras", null, "https://play.google.com/store/apps/details?id=");
    };

  })
  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
      navIcons.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function () {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function () {
      document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function () {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }
    };

    $scope.setExpanded = function (bool) {
      $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function (location) {
      var hasHeaderFabLeft = false;
      var hasHeaderFabRight = false;

      switch (location) {
        case 'left':
          hasHeaderFabLeft = true;
          break;
        case 'right':
          hasHeaderFabRight = true;
          break;
      }

      $scope.hasHeaderFabLeft = hasHeaderFabLeft;
      $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function () {
      var content = document.getElementsByTagName('ion-content');
      for (var i = 0; i < content.length; i++) {
        if (!content[i].classList.contains('has-header')) {
          content[i].classList.toggle('has-header');
        }
      }

    };

    $scope.hideHeader = function () {
      $scope.hideNavBar();
      $scope.noHeader();
    };

    $scope.showHeader = function () {
      $scope.showNavBar();
      $scope.hasHeader();
    };

    $scope.clearFabs = function () {
      var fabs = document.getElementsByClassName('button-fab');
      if (fabs.length && fabs.length > 1) {
        fabs[0].remove();
      }
    };
  })
  .controller('CategoriasCtrl', function ($scope, $location, ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $scope.categorias = categoriasService.getAll();
    $scope.nombre = "";

    $scope.seleccionarCategoria = function (categoria) {
      categoriasService.seleccionar(categoria);
      $location.path("/app/detalleCategoria");
    };
    $scope.agregarCategoria = function (nombre) {
      categoriasService.add({'nombre': nombre});
      $scope.categorias = categoriasService.getAll();
      $scope.nombre = "";
      $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight({
          selector: '.animate-fade-slide-in .item'
        });

      }, 100);
    };


    $timeout(function () {
      ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-down .item'
      });


    }, 200);


    // Activate ink for controller
    ionicMaterialInk.displayEffect();

  })
  .controller('DetalleCategoriaCtrl', function ($scope, ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $scope.categoriaSeleccionada = categoriasService.getSeleccionada();


    $timeout(function () {
      ionicMaterialMotion.fadeSlideIn({
        selector: '.animate-fade-slide-in .item'
      });

    }, 200);


    // Activate ink for controller
    ionicMaterialInk.displayEffect();

  });







