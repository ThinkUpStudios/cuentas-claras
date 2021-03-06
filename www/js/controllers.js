angular.module('starter.controllers', ['ionic', 'ionMdInput'])

    .run(function ($rootScope, $cordovaSocialSharing, $ionicPopover) {
        $ionicPopover.fromTemplateUrl('templates/menu.html', {
            scope: $rootScope
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
    .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, Categoria, $location, $ionicNavBarDelegate, $rootScope, $ionicHistory) {
        // Form data for the login modal

        $scope.$on('$ionicView.enter', function () {
            $timeout(function () {
                $ionicHistory.clearHistory();
            })

        });


        $scope.nuevoEvento = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Nuevo Evento',
                template: 'Se perderá todo lo cargado. Desea continuar?',
                cancelText: 'No',
                okText: 'Si'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    $rootScope.$broadcast("nuevoEvento");
                    $location.path("/tab/categorias");
                }
            });


        };


        $scope.getMenuSide = function () {
            if (ionic.Platform.isIOS()) {
                $ionicNavBarDelegate.showBackButton(false);
                return "right";
            } else {
                $ionicNavBarDelegate.showBackButton(true);
                return "left";
            }
        };
        $scope.goto = function (path) {
            $location.path(path);
        };
        $scope.platform = ionic.Platform;
        /*   $scope.loginData = {};
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
         };*/
    })
    .controller('CategoriasCtrl', function ($rootScope, $scope, $location, $ionicPopup, $timeout, categoriasService, $document, invitadosService, Categoria, $ionicHistory) {
        //  $scope.$parent.showHeader();
        $scope.isExpanded = true;
        $scope.categoria = new Categoria("", null);
        // $scope.$parent.setExpanded(true);
        $scope.editando = false;
        $scope.mostrarFormulario = false;
        $scope.mostrarBotonEditar = true;


        // $scope.$parent.setHeaderFab('right');
        $scope.categoriaEditada = new Categoria("", null);

        $scope.goForward = function () {

            $location.path("/tab/invitados");

        };

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


        $scope.borrarCategoria = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Borrar Categoría?',
                cancelText: 'No',
                okText: 'Si'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    categoriasService.remove($scope.categoria);
                    invitadosService.eliminarCategoria($scope.categoria);
                    update();
                    init();
                }
            });

        };

        $scope.editarCategoria = function (cat) {
            categoriasService.seleccionar(cat);
            $scope.mostrarBotonEditar = true;
            $scope.mostrarFormulario = false;
            $location.path("/editarCategoria");

        };
        $scope.nuevaCategoria = function () {
            $scope.mostrarFormulario = true;
            $scope.mostrarBotonEditar = false;
            $scope.editando = false;
            $scope.categoriaEditada = new Categoria("", null);

        };

        $scope.agregarCategoria = function () {
            if ($scope.categoriaEditada.nombre) {
                if ($scope.editando) {
                    if ($scope.categoriaEditada.nombre == $scope.categoria.nombre) {
                        $scope.categoria.precioUnitario = $scope.categoriaEditada.precioUnitario;
                        update();
                        $scope.closeForm();
                    } else if (categoriasService.existe($scope.categoriaEditada)) {
                        document.getElementById("CAT_" + $scope.categoriaEditada.nombre).classList.add("error");
                        $timeout(function () {
                            document.getElementById("CAT_" + $scope.categoriaEditada.nombre).classList.remove("error");
                        }, 700);
                    } else {
                        $scope.categoria.precioUnitario = $scope.categoriaEditada.precioUnitario;
                        $scope.categoria.nombre = $scope.categoriaEditada.nombre;
                        update();
                        $scope.closeForm();
                    }
                } else {
                    if (categoriasService.existe($scope.categoriaEditada)) {
                        document.getElementById("CAT_" + $scope.categoriaEditada.nombre).classList.add("error");
                        $timeout(function () {
                            document.getElementById("CAT_" + $scope.categoriaEditada.nombre).classList.remove("error");
                        }, 700);
                    } else {
                        $scope.categoria.precioUnitario = $scope.categoriaEditada.precioUnitario;
                        $scope.categoria.nombre = $scope.categoriaEditada.nombre;
                        categoriasService.add($scope.categoria);
                        invitadosService.agregarCategoria($scope.categoria);
                        update();
                    }
                }

            }
        };
        function update() {
            $scope.categoriaEditada = new Categoria("", null);
            $scope.categoria = new Categoria("", null);
            $scope.$broadcast("$stateChangeSuccess");

        }

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
            document.getElementById('fab-categoria-plus').classList.toggle('on');

        }, 10);

        // Activate ink for controller


    })

    .controller('InvitadosCtrl', function ($scope, $rootScope, $location, $timeout, categoriasService, invitadosService, Invitado, $ionicHistory) {

        $scope.isExpanded = true;

        $scope.balance = "Cuentas Claras!";
        $scope.showBalance = false;
        $scope.recaudado = 0;
        $scope.pagados = [];
        $scope.invitados = invitadosService.getAll();

        $scope.$on('$ionicView.enter', function () {
            $timeout(function () {

                $scope.balance = $scope.calcularBalance();


            });
        });

        $scope.goBack = function () {
            $location.path("/tab/categorias")

        };
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
                    $scope.balance = $scope.calcularBalance();
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
            } else {
                $scope.pagados.splice($scope.pagados.indexOf(invitado), 1);

            }
            $scope.recaudado = 0;
            $scope.pagados.forEach(function (e, i, a) {
                $scope.recaudado += parseFloat($scope.calcularSaldo(e));

            });
            $scope.recaudado = parseFloat($scope.recaudado).toFixed(2);
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
            $scope.mostrarBotonEditar = true;
            $scope.mostrarFormulario = false;

            $location.path("/nuevoInvitado");
        };


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
        }, 10);


        // Activate ink for controller


    })

    .controller('NuevoInvitadoCtrl', function ($scope, $location, ngToast, $timeout, categoriasService, Invitado, invitadosService, $ionicPopup, $ionicHistory, $state) {
        $scope.isExpanded = true;
        $scope.categoriasSeleccionadas = [];

        function init() {
            $scope.categoriasSeleccionadas = [];
            $scope.invitado = invitadosService.getSeleccionado();

            var c;

            categoriasService.getAll().forEach(function (cat, i, a) {

                if ($scope.invitado.nombre == "") {
                    $scope.invitado.agregarCategoria(cat);
                }
                $scope.categoriasSeleccionadas.push({
                    categoria: cat,
                    seleccionado: $scope.invitado.tieneCategoria(cat)
                });
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

        $scope.borrarInvitado = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Borrar invitado?',
                cancelText: 'No',
                okText: 'Si'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    invitadosService.remove($scope.invitado);
                    $ionicHistory.clearCache().then(
                        function(){
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go("tab.invitados")
                        }
                    );
                }
            });

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
            $ionicHistory.clearCache().then(
                function(){
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go("tab.invitados")
                }
            );
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
                $ionicHistory.clearCache().then(
                    function(){
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot:true
                        });
                        $state.go("tab.invitados")
                    }
                );

            }
        };

        $timeout(function () {
            document.getElementById('fab-nextInvitado').classList.toggle('on');
            document.getElementById('fab-borrarInvitado').classList.toggle('on');

        }, 10);


        // Activate ink for controller


    })


    .controller('NuevaCategoriaCtrl', function ($scope, $location, $ionicPopup, ngToast, $timeout, categoriasService, invitadosService, Categoria, $ionicHistory, $state) {

        $scope.isExpanded = true;
        $scope.invitadosConsumidores = [];
        function init() {
            $scope.invitadosConsumidores = [];
            $scope.categoria = categoriasService.getSeleccionada();

            var c;

            invitadosService.getAll().forEach(function (inv, i, a) {
                $scope.invitadosConsumidores.push({invitado: inv, seleccionado: inv.tieneCategoria($scope.categoria)});
            });

        };

        init();

        $timeout(function () {
            document.getElementById('fab-nextInvitado').classList.toggle('on');
            document.getElementById('fab-borrarInvitado').classList.toggle('on');

        }, 10);
        $scope.guardarCategoria = function () {
            var i;
            for (var inv in $scope.invitadosConsumidores) {
                i = $scope.invitadosConsumidores[inv];
                if (i.seleccionado) {
                    i.invitado.agregarCategoria($scope.categoria);
                } else {
                    i.invitado.quitarCategoria($scope.categoria);
                }
            }
            if (!$scope.categoria.precioUnitario) {
                $scope.categoria.precioUnitario = 0;
            }
            categoriasService.add($scope.categoria);
            $ionicHistory.clearCache().then(function(){
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go("tab.categorias")
            });
        };

        $scope.$on('$ionicView.enter', function () {
            $timeout(function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
            });
        });

        $scope.borrarCategoria = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Borrar la categoría?',
                cancelText: 'No',
                okText: 'Si'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    categoriasService.remove($scope.categoria);
                    invitadosService.quitarCategoria($scope.categoria);
                    $ionicHistory.clearCache().then(function(){
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: true
                        });
                        $state.go("tab.categorias")
                    });


                }
            });

        };

    });











