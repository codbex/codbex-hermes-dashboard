angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-hermes.entities.SalesOrder';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-hermes/gen/api/entities/SalesOrder.js";
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
					messageHub.showAlertError("SalesOrder", `Unable to count SalesOrder: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("SalesOrder", `Unable to list SalesOrder: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

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
			messageHub.showDialogWindow("SalesOrder-details", {
				action: "select",
				entity: entity,
				optionsQuotation: $scope.optionsQuotation,
				optionsOwner: $scope.optionsOwner,
				optionsCustomer: $scope.optionsCustomer,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("SalesOrder-details", {
				action: "create",
				entity: {},
				optionsQuotation: $scope.optionsQuotation,
				optionsOwner: $scope.optionsOwner,
				optionsCustomer: $scope.optionsCustomer,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("SalesOrder-details", {
				action: "update",
				entity: entity,
				optionsQuotation: $scope.optionsQuotation,
				optionsOwner: $scope.optionsOwner,
				optionsCustomer: $scope.optionsCustomer,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete SalesOrder?',
				`Are you sure you want to delete SalesOrder? This action cannot be undone.`,
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
							messageHub.showAlertError("SalesOrder", `Unable to delete SalesOrder: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsQuotation = [];
		$scope.optionsOwner = [];
		$scope.optionsCustomer = [];
		$scope.optionsCurrencyCode = [];

		$http.get("/services/js/codbex-hermes/gen/api/Question/Quotation.js").then(function (response) {
			$scope.optionsQuotation = response.data.map(e => {
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

		$http.get("/services/js/codbex-hermes/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsCustomer = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-hermes/gen/api/entities/Currency.js").then(function (response) {
			$scope.optionsCurrencyCode = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Code
				}
			});
		});
		$scope.optionsQuotationValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsQuotation.length; i++) {
				if ($scope.optionsQuotation[i].value === optionKey) {
					return $scope.optionsQuotation[i].text;
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
		$scope.optionsCustomerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCustomer.length; i++) {
				if ($scope.optionsCustomer[i].value === optionKey) {
					return $scope.optionsCustomer[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyCodeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCurrencyCode.length; i++) {
				if ($scope.optionsCurrencyCode[i].value === optionKey) {
					return $scope.optionsCurrencyCode[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
