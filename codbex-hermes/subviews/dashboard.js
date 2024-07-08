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

}]);