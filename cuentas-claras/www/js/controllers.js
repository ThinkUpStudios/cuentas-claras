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
  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, Categoria, $rootScope, $location) {
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

    $scope.getMenuSide = function () {
      if (ionic.Platform.isIOS()) {
        return "right";
      } else {
        return "left";
      }
    };
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
    $scope.nuevoEvento = function () {
      $rootScope.$broadcast("nuevoEvento");
      $location.path("/app/categorias")

    };

    $scope.goto = function (path) {
      $location.path(path);
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
  .controller('CategoriasCtrl', function ($rootScope, $scope, $location, $ionicPopup, ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService, $document, invitadosService, Categoria) {
    $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.categoria = new Categoria("", null);
    $scope.$parent.setExpanded(true);
    $scope.editando = false;
    $scope.mostrarFormulario = false;
    $scope.mostrarBotonEditar = true;
    $scope.$parent.setHeaderFab('right');


    $rootScope.$on("nuevoEvento", function () {
      $scope.mostrarFormulario = false;
      $scope.mostrarBotonEditar = true;
      $scope.categorias = categoriasService.getAll();

    });


    $scope.categorias = categoriasService.getAll();

    function init() {
      $scope.mostrarFormulario = false;
      $scope.mostrarBotonEditar = true;

      $scope.categoria = new Categoria("", null);
      $scope.editando = false;



    }

    $scope.closeForm = function () {
      init();
    };
    $scope.getCategorias = function () {
      return categoriasService.getAll();
    };


    $scope.borrarCategoria = function (cat) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Borrar Categoría?',
        cancelText: 'No',
        okText: 'Si'
      });

      confirmPopup.then(function (res) {
        if (res) {
          categoriasService.remove(cat);
          update();
          init();
        }
      });

    };

    $scope.editarCategoria = function (cat) {
      init();
      $scope.editando = true;
      $scope.mostrarFormulario = true;
      $scope.mostrarBotonEditar = false;
      $scope.categoria = cat;
    };
    $scope.nuevaCategoria = function () {
      $scope.mostrarFormulario = true;
      $scope.mostrarBotonEditar = false;
      $scope.editando = false;
      $scope.categoria = new Categoria("", null);

    };

    $scope.agregarCategoria = function () {
      if ($scope.categoria.nombre) {
        if (!$scope.editando && categoriasService.existe($scope.categoria)) {
          document.getElementById("CAT_" + $scope.categoria.nombre).classList.add("error");
          $timeout(function () {
            document.getElementById("CAT_" + $scope.categoria.nombre).classList.remove("error");
          }, 700)
        } else {
          categoriasService.add($scope.categoria);
          update();
        }
      } else {
        document.getElementById("nombreCategoria").classList.add("error");
        $timeout(function () {
          document.getElementById("nombreCategoria").classList.remove("error");
        }, 800);
      }
    };
    function update() {
      $scope.categoria = new Categoria("", null);
      $scope.$broadcast("$stateChangeSuccess");
      $timeout(function () {
        ionicMaterialMotion.ripple({
          selector: '.animate-ripple .item '
        });

      }, 100);
    }
    $scope.seleccionarCategoria = function (categoria) {


    };
    $scope.calcularCantidad = function (cat) {
      return invitadosService.contarRegistradosEnCategoria(cat);
    };

    $scope.calcularTotal = function () {
      var total = 0;

      categoriasService.getAll().forEach(function (cat, i, a) {
        total += cat.getTotal();
      });
      if (total == 0) {
        return "0.00"
      }
      return total;

    };
    $timeout(function () {
      var elements = document.getElementsByClassName('tutorial');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.toggle('animate-fade-in-active')
      }
      ;
    }, 800);

    $timeout(function () {
      document.getElementById('fab-categoria-plus').classList.toggle('on');

      ionicMaterialMotion.ripple({
        selector: '.animate-ripple .item '
      });

    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

  })

  .controller('InvitadosCtrl', function ($scope, $rootScope, $location, ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService, invitadosService, Invitado) {
    $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $scope.balance = "Cuentas Claras!";
    $scope.showBalance = false;
    $scope.recaudado = 0;
    $scope.pagados = [];
    $scope.invitados = invitadosService.getAll();


    $rootScope.$on("nuevoEvento", function () {
      $scope.mostrarFormulario = false;
      $scope.mostrarBotonEditar = true;
      $scope.invitados = invitadosService.getAll();

    });

    $scope.editando = false;
    $scope.mostrarFormulario = false;
    $scope.mostrarBotonEditar = true;

    function init() {
      $scope.mostrarFormulario = false;
      $scope.mostrarBotonEditar = true;
      $scope.invitado = new Invitado("");
      $scope.editando = false;

    }

    $scope.closeForm = function () {
      init();
    };

    $scope.getSaldo = function (inv) {
      var total = $scope.calcularSaldo(inv);
      if (total == 0) {
        return "Salió hecho";
      } else if (total > 0) {
        return "Debe $" + total;

      } else {
        return "A su favor $" + (total * -1);
      }
    };
    $scope.agregarInvitado = function () {
      if ($scope.invitado.nombre) {
        if (!invitadosService.existe($scope.invitado)) {
          categoriasService.getAll().forEach(function (cat, i, a) {
            $scope.invitado.agregarCategoria(cat);
          });
          if (!$scope.invitado.aFavor) {
            $scope.invitado.aFavor = 0;
          }
          invitadosService.add($scope.invitado);
          $scope.invitado = new Invitado("", null);
          $scope.invitados = invitadosService.getAll();
          $scope.$broadcast("$stateChangeSuccess");
          $timeout(function () {
            ionicMaterialMotion.ripple({
              selector: '.animate-ripple .item '
            });

          }, 100);
        } else {
          document.getElementById("INV_" + $scope.invitado.nombre).classList.add("error");
          $timeout(function () {
            document.getElementById("INV_" + $scope.invitado.nombre).classList.remove("error");
          }, 700)
        }

      } else {
        document.getElementById("nombreInvitado").classList.add("error");
        $timeout(function () {
          document.getElementById("nombreInvitado").classList.remove("error");
        }, 700)
      }


    };
    $scope.totalCategorias = function () {
      var total = 0;

      categoriasService.getAll().forEach(function (cat, i, a) {
        total += cat.getTotal();
      });
      if (total == 0) {
        return "0.00"
      }
      return total;

    };

    $scope.yaPago = function (invitado) {
      return $scope.pagados.indexOf(invitado) >= 0;
    };

    $scope.pagar = function (invitado) {
      if (!$scope.yaPago(invitado)) {
        $scope.pagados.push(invitado);
        $scope.recaudado += parseFloat($scope.calcularSaldo(invitado));
      } else {
        $scope.pagados.splice($scope.pagados.indexOf(invitado), 1);
        $scope.recaudado -= parseFloat($scope.calcularSaldo(invitado));
      }
    };
    $scope.getInvitados = function () {
      return invitadosService.getAll();

    };
    $scope.nuevoInvitado = function () {
      $scope.mostrarFormulario = true;
      $scope.mostrarBotonEditar = false;
      $scope.editando = false;
      $scope.invitado = new Invitado("");
    };
    $scope.calcularSaldo = function (invitado) {
      var total = 0;
      var inscriptos = 0;
      invitado.categorias.forEach(function (cat, i, a) {
        inscriptos = invitadosService.contarRegistradosEnCategoria(cat);
        if (inscriptos > 0) {
          total += cat.getTotal() / inscriptos;
        }
      });
      return (total - invitado.aFavor).toFixed(2);

    };
    $scope.editarInvitado = function (invitado) {
      invitadosService.seleccionar(invitado);
      $location.path("/app/nuevoInvitado");
    };

    $scope.$on('$stateChangeSuccess', function () {
      $scope.balance = $scope.calcularBalance();
      $timeout(function () {
        if ($scope.showBalance) {
          if (!document.getElementsByClassName('has-subtotales')[0].classList.contains('error')) {
            document.getElementsByClassName('has-subtotales')[0].classList.add('error');
          }
        } else {
          document.getElementsByClassName('has-subtotales')[0].classList.remove('error');
        }

      }, 200);

      if ($scope.getInvitados().length > 0) {
        $timeout(function () {
          var elements = document.getElementsByClassName('tutorial');
          for (var i = 0; i < elements.length; i++) {
            elements[i].classList.toggle('animate-fade-in-active')
          }
        }, 800);
      }

      $timeout(function () {
        ionicMaterialMotion.ripple({
          selector: '.animate-ripple .item'
        });

      }, 200)
    });

    $scope.calcularTotal = function () {
      var total = 0;

      invitadosService.getAll().forEach(function (inv, i, a) {
        total += $scope.calcularSaldo(inv);
      });
      return total;

    };
    function getTotalNeto() {
      return categoriasService.getTotalGastos() - invitadosService.getTotalAportado();
    }

    $scope.calcularBalance = function () {
      var total = getTotalNeto();


      if (total == 0) {
        $scope.showBalance = false;
        return "Cuentas Claras!";
      } else {
        $scope.showBalance = true;
        if (total < 0) {
          return "Faltan asignar $ " + (total * -1) + " de gastos en las categorías";
        } else {
          return "Faltan asignar $ " + total + " a favor de los invitados";
        }
      }
    };

    $timeout(function () {

      document.getElementById('fab-invitado-plus').classList.toggle('on');
    }, 200);

    $timeout(function () {
      var elements = document.getElementsByClassName('tutorial');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.toggle('animate-fade-in-active')
      }
      ;
    }, 800);
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

  })

  .controller('NuevoInvitadoCtrl', function ($scope, $location, ngToast, ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService, Invitado, invitadosService) {
    $scope.$parent.showHeader();

    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $scope.categoriasSeleccionadas = [];

    function init() {
      $scope.categoriasSeleccionadas = [];
      var invitado = invitadosService.getSeleccionado();
      var c;

      if (invitado) {
        $scope.invitado = invitado;
      } else {
        $scope.invitado = new Invitado("", null);

      }
      categoriasService.getAll().forEach(function (cat, i, a) {

        if ($scope.invitado.nombre == "") {
          $scope.invitado.agregarCategoria(cat);
        }
        $scope.categoriasSeleccionadas.push({categoria: cat, seleccionado: $scope.invitado.tieneCategoria(cat)});
      });

    };

    init();

    $scope.getCategorias = function () {
      return categoriasService.getAll();
    };

    $scope.getCategorias = function () {
      return categoriasService.getAll();
    };

    $scope.quitarCategoria = function (categoria) {
      $scope.invitado.quitarCategoria(categoria);
    };

    $scope.guardarInvitado = function () {
      var c;
      for (var cat in $scope.categoriasSeleccionadas) {
        c = $scope.categoriasSeleccionadas[cat];
        if (c.seleccionado) {
          $scope.invitado.agregarCategoria(c.categoria);
        } else {
          $scope.invitado.quitarCategoria(c.categoria);
        }
      }
      if (!$scope.invitado.aFavor) {
        $scope.invitado.aFavor = 0;
      }
      invitadosService.add($scope.invitado);
      $location.path("/app/invitados");
    };

    $scope.agregarNuevoInvitado = function () {
      if ($scope.invitado.nombre == "") {
        ngToast.create({
          className: 'error',
          content: 'Complete el Nombre',
          verticalPosition: 'bottom',
          timeout: 1500,
          horizontalPosition: 'center'

        });
      } else {
        this.guardarInvitado();
        invitadosService.seleccionar(new Invitado(""));
        ngToast.create({
          className: 'success',
          content: 'Categoría agregada',
          verticalPosition: 'bottom',
          timeout: 1500,
          horizontalPosition: 'center'

        });
        init();
      }
    };

    $scope.crearInvitadoYVolver = function () {
      if ($scope.invitado.nombre == "") {
        ngToast.create({
          className: 'error',
          content: 'Complete el Nombre',
          verticalPosition: 'bottom',
          timeout: 1500,
          horizontalPosition: 'center'

        });
      } else {
        this.guardarInvitado();
        $location.path("/app/invitados");
      }
    };

    $timeout(function () {
      document.getElementById('fab-nextInvitado').classList.toggle('on');
    }, 100);

    ionicMaterialMotion.fadeSlideInRight({
      selector: '.animate-fade-slide-in-right .card-item'
    });
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

  })


  .controller('NuevaCategoriaCtrl', function ($scope, $location, ngToast, ionicMaterialInk, $timeout, ionicMaterialMotion, categoriasService, Categoria) {
    $scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);

    var categoria = categoriasService.getSeleccionada();
    if (categoria) {
      $scope.data = categoria;
    } else {
      $scope.data = new Categoria("", null);
    }


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










