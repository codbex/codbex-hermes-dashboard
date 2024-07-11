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

    $scope.leadData = [
        { label: 'Initial', value: 60 },
        { label: 'Open', value: 54 },
        { label: 'Contacted', value: 39 },
        { label: 'Replied', value: 26 },
        { label: 'Opportunity', value: 22 },
        { label: 'Quotation', value: 16 },
        { label: 'Lost', value: 14 },
        { label: 'Confirmed', value: 12 },
        { label: 'Closed', value: 10 }
    ];

}]);