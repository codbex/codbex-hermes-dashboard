const dashboard = angular.module('dashboard', ['ideUI', 'ideView', "applicationTiles"]);

dashboard.controller('DashboardController', ['$scope', '$document', '$http', 'messageHub', function ($scope, $document, $http, messageHub) {
    $scope.state = {
        isBusy: true,
        error: false,
        busyText: "Loading...",
    };

    angular.element($document[0]).ready(async function () {

        $scope.$apply(function () {
            $scope.state.isBusy = false;
        });
    });

    $scope.today = new Date();

    async function getProductData() {
        try {
            const response = await $http.get("/services/ts/codbex-athena/api/ProductService.ts/productData");
            return response.data;
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }

}]);