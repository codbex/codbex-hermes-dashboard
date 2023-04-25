angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'hermes-app.Deliveries.Delivery';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/hermes-app/gen/api/Deliveries/Delivery.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Delivery Details",
			create: "Create Delivery",
			update: "Update Delivery"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.formErrors = {};
				$scope.optionsSalesOrderItem = [];
				$scope.optionsDeliveryStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Initiated) {
					msg.data.entity.Initiated = new Date(msg.data.entity.Initiated);
				}
				if (msg.data.entity.ETA) {
					msg.data.entity.ETA = new Date(msg.data.entity.ETA);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsSalesOrderItem = msg.data.optionsSalesOrderItem;
				$scope.optionsDeliveryStatus = msg.data.optionsDeliveryStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsSalesOrderItem = msg.data.optionsSalesOrderItem;
				$scope.optionsDeliveryStatus = msg.data.optionsDeliveryStatus;
				$scope.action = 'create';
				// Set Errors for required fields only
				$scope.formErrors = {
				};
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Initiated) {
					msg.data.entity.Initiated = new Date(msg.data.entity.Initiated);
				}
				if (msg.data.entity.ETA) {
					msg.data.entity.ETA = new Date(msg.data.entity.ETA);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsSalesOrderItem = msg.data.optionsSalesOrderItem;
				$scope.optionsDeliveryStatus = msg.data.optionsDeliveryStatus;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Delivery", `Unable to create Delivery: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Delivery", "Delivery successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Delivery", `Unable to update Delivery: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Delivery", "Delivery successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);