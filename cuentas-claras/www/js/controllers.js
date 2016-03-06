angular.module('starter.controllers', ['ionic', 'ionMdInput'])

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
  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, Categoria) {
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
  .controller('CategoriasCtrl', function ($scope, $location, ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService, Categoria) {
    $scope.$parent.showHeader();

    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $scope.nombre = "";
    $scope.getCategorias = function () {
      return categoriasService.getAll();
    };
    $scope.nuevaCategoria = function(){
      categoriasService.seleccionar(new Categoria("",0,0));
      $location.path("/app/nuevaCategoria");
    };
    $scope.seleccionarCategoria = function (categoria) {
      categoriasService.seleccionar(categoria);
      $location.path("/app/nuevaCategoria");
    };
    ionicMaterialMotion.fadeSlideInRight({
      selector: '.animate-fade-slide-in-right .card-item'
    });
    $timeout(function () {


      document.getElementById('fab-categoria-plus').classList.toggle('on');

    }, 200);


    // Activate ink for controller
    ionicMaterialInk.displayEffect();

  })

  .controller('NuevaCategoriaCtrl', function ($scope, $location, ngToast,  ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService, Categoria) {
    $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);

    $scope.nombre_cat = "";
    $scope.precioUnitario_cat = 0;
    $scope.cantidad_cat = 0;
    var categoria = categoriasService.getSeleccionada();
    if(categoria) {
      $scope.data = categoria;
    }else{
      $scope.data =  new Categoria("",0,0);
    }


    $scope.guardarCategoria = function (c) {
      categoriasService.add(c);
    };

    $scope.crearCategoria = function () {
      if ($scope.data.nombre == "") {
        ngToast.create({
          className: 'error',
          content: 'Complete el Nombre',
          verticalPosition: 'bottom',
          timeout: 1500,
          horizontalPosition: 'center'

        });

      } else {
        this.guardarCategoria($scope.data);
        $location.path("/categorias");
      }
    };

    $scope.agregarCategoria = function () {
      if ($scope.data.nombre == "") {
        ngToast.create({
          className: 'error',
          content: 'Complete el Nombre',
          verticalPosition: 'bottom',
          timeout: 1500,
          horizontalPosition: 'center'

        });

      } else {
        this.guardarCategoria($scope.data);
        $scope.data = new Categoria("",0,0);
        ngToast.create({
          className: 'success',
          content: 'Categoría agregada',
          verticalPosition: 'bottom',
          timeout: 1500,
          horizontalPosition: 'center'

        });
      }
    };

    $timeout(function () {
      document.getElementById('fab-nuevo').classList.toggle('on');
      document.getElementById('fab-next').classList.toggle('on');
    }, 100);


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







