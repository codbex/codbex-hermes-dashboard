angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-hermes.entities.LeadNote';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-hermes/gen/api/entities/LeadNote.js";
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
					messageHub.showAlertError("LeadNote", `Unable to count LeadNote: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("LeadNote", `Unable to list LeadNote: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Timestamp) {
							e.Timestamp = new Date(e.Timestamp);
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
			messageHub.showDialogWindow("LeadNote-details", {
				action: "select",
				entity: entity,
				optionsLead: $scope.optionsLead,
				optionsNoteType: $scope.optionsNoteType,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("LeadNote-details", {
				action: "create",
				entity: {},
				optionsLead: $scope.optionsLead,
				optionsNoteType: $scope.optionsNoteType,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("LeadNote-details", {
				action: "update",
				entity: entity,
				optionsLead: $scope.optionsLead,
				optionsNoteType: $scope.optionsNoteType,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete LeadNote?',
				`Are you sure you want to delete LeadNote? This action cannot be undone.`,
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
							messageHub.showAlertError("LeadNote", `Unable to delete LeadNote: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsLead = [];
		$scope.optionsNoteType = [];

		$http.get("/services/js/codbex-hermes/gen/api/entities/Lead.js").then(function (response) {
			$scope.optionsLead = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-hermes/gen/api/entities/NoteType.js").then(function (response) {
			$scope.optionsNoteType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsLeadValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsLead.length; i++) {
				if ($scope.optionsLead[i].value === optionKey) {
					return $scope.optionsLead[i].text;
				}
			}
			return null;
		};
		$scope.optionsNoteTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsNoteType.length; i++) {
				if ($scope.optionsNoteType[i].value === optionKey) {
					return $scope.optionsNoteType[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
