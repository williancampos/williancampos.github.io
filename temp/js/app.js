var app = angular.module('nxnet', ["isteven-multi-select"]);

app.controller('VeiculoBatchesCtrl', function ($scope) {
    $scope.auth = "Basic d2lsbGlhbkBub3h4b25zYXQuY29tLmJyOm5veHhvbnNhdDEyMw==";
    $scope.title = "Veículos";
    $scope.empresas = [];
    $scope.veiculos = [];
    $("body").css("cursor", "progress");
    $.ajax({
        url: 'https://antigo-mapa-171-rest-dot-noxxonsat-nxnet.appspot.com/rest/empresas?mode=garagem',
        type: "GET",
        headers: { Authorization: $scope.auth },
        statusCode: {
            404: function () {
                console.log("404");
            },
            500: function () {
                console.log("500");
            }
        }
    }).done(function (data) {
        $scope.$apply(function () {
            var empresas = data.empresas
            $scope.empresas = [];
            for (i in empresas) {
                var empresa = empresas[i];
                $scope.empresas.push({ id: empresa.id, nome: empresa.nome, ticked: false });
            }
        });
        $("body").css("cursor", "default");
    }).fail(function (xhr, statusText, err) {
        console.log("Erro");
        console.log(err);
        $("body").css("cursor", "default");
    });

    $scope.filter = function () {
        angular.forEach($scope.selectedEmpresas, function (value, key) {
            $scope.veiculos = [];
            $.ajax({
                url: 'https://antigo-mapa-171-rest-dot-noxxonsat-nxnet.appspot.com/rest/veiculosbatch?idEmpresa=' + value.id,
                type: "GET",
                headers: { Authorization: $scope.auth },
                statusCode: {
                    404: function () {
                        console.log("404");
                    },
                    500: function () {
                        console.log("500");
                    }
                }
            }).done(function (data) {
                $scope.$apply(function () {
                    $scope.veiculos = $scope.veiculos.concat(data.veiculos);
                });
            }).fail(function (xhr, statusText, err) {
                console.log("Erro");
                console.log(err);
            });
        });

    }
});