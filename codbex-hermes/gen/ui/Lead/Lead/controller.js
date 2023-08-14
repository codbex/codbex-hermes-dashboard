angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-hermes.Lead.Lead';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-hermes/gen/api/Lead/Lead.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			$scope.dataPage = pageNumber;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Lead", `Unable to count Lead: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Lead", `Unable to list Lead: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Lead-details", {
				action: "select",
				entity: entity,
				optionsIndustry: $scope.optionsIndustry,
				optionsLeadStatus: $scope.optionsLeadStatus,
				optionsOwner: $scope.optionsOwner,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Lead-details", {
				action: "create",
				entity: {},
				optionsIndustry: $scope.optionsIndustry,
				optionsLeadStatus: $scope.optionsLeadStatus,
				optionsOwner: $scope.optionsOwner,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Lead-details", {
				action: "update",
				entity: entity,
				optionsIndustry: $scope.optionsIndustry,
				optionsLeadStatus: $scope.optionsLeadStatus,
				optionsOwner: $scope.optionsOwner,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Lead?',
				`Are you sure you want to delete Lead? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("Lead", `Unable to delete Lead: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsIndustry = [];
		$scope.optionsLeadStatus = [];
		$scope.optionsOwner = [];

		$http.get("/services/js/codbex-hermes/gen/api/entities/Industry.js").then(function (response) {
			$scope.optionsIndustry = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-hermes/gen/api/entities/LeadStatus.js").then(function (response) {
			$scope.optionsLeadStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-hermes/gen/api/entities/Employee.js").then(function (response) {
			$scope.optionsOwner = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsIndustryValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsIndustry.length; i++) {
				if ($scope.optionsIndustry[i].value === optionKey) {
					return $scope.optionsIndustry[i].text;
				}
			}
			return null;
		};
		$scope.optionsLeadStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsLeadStatus.length; i++) {
				if ($scope.optionsLeadStatus[i].value === optionKey) {
					return $scope.optionsLeadStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsOwnerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOwner.length; i++) {
				if ($scope.optionsOwner[i].value === optionKey) {
					return $scope.optionsOwner[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
