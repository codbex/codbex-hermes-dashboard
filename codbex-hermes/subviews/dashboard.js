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

    $scope.leadData = {
        Initial: 10,
        Open: 8,
        Contacted: 6,
        Replied: 5,
        Opportunity: 4,
        Quotation: 3,
        Lost: 2,
        Confirmed: 1,
        Closed: 0
    };

}]);