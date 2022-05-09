angular.module('page', ['ngAnimate', 'ui.bootstrap']);
angular.module('page')
.factory('httpRequestInterceptor', function () {
	var csrfToken = null;
	return {
		request: function (config) {
			config.headers['X-Requested-With'] = 'Fetch';
			config.headers['X-CSRF-Token'] = csrfToken ? csrfToken : 'Fetch';
			return config;
		},
		response: function(response) {
			var token = response.headers()['x-csrf-token'];
			if (token) {
				csrfToken = token;
			}
			return response;
		}
	};
})
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
}])
.factory('$messageHub', [function(){
	var messageHub = new FramesMessageHub();

	var message = function(evtName, data){
		messageHub.post({data: data}, 'codbex-sales.Leads.Lead.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onEntityRefresh: function(callback) {
			on('codbex-sales.Leads.Lead.refresh', callback);
		},
		onIndustryModified: function(callback) {
			on('codbex-sales.Leads.Industry.modified', callback);
		},
		onLeadStatusModified: function(callback) {
			on('codbex-sales.Leads.LeadStatus.modified', callback);
		},
		onEmployeeModified: function(callback) {
			on('codbex-sales.Leads.Employee.modified', callback);
		},
		messageEntityModified: function() {
			message('modified');
		},
		messageEntitySelected: function(id) {
			message('selected', id);
		}
	};
}])
.controller('PageController', function ($scope, $http, $messageHub) {

	var api = '/services/v4/js/codbex-sales/gen/api/Leads/Lead.js';
	var industryOptionsApi = '/services/v4/js/codbex-sales/gen/api/Leads/Industry.js';
	var statusOptionsApi = '/services/v4/js/codbex-sales/gen/api/Leads/LeadStatus.js';
	var ownerOptionsApi = '/services/v4/js/codbex-sales/gen/api/Employees/Employee.js';

	$scope.industryOptions = [];

	$scope.statusOptions = [];

	$scope.ownerOptions = [];

	$scope.dateOptions = {
		startingDay: 1
	};
	$scope.dateFormats = ['yyyy/MM/dd', 'dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
	$scope.monthFormats = ['yyyy/MM', 'MMMM-yyyy', 'MM.yyyy', 'MMMM/yyyy'];
	$scope.weekFormats = ['yyyy/w', 'w-yyyy', 'w.yyyy', 'w/yyyy', "w"];
	$scope.dateFormat = $scope.dateFormats[0];
	$scope.monthFormat = $scope.monthFormats[1];
	$scope.weekFormat = $scope.weekFormats[3];

	function industryOptionsLoad() {
		$http.get(industryOptionsApi)
		.then(function(data) {
			$scope.industryOptions = data.data;
		});
	}
	industryOptionsLoad();

	function statusOptionsLoad() {
		$http.get(statusOptionsApi)
		.then(function(data) {
			$scope.statusOptions = data.data;
		});
	}
	statusOptionsLoad();

	function ownerOptionsLoad() {
		$http.get(ownerOptionsApi)
		.then(function(data) {
			$scope.ownerOptions = data.data;
		});
	}
	ownerOptionsLoad();

	$scope.dataPage = 1;
	$scope.dataCount = 0;
	$scope.dataOffset = 0;
	$scope.dataLimit = 50;

	$scope.getPages = function() {
		return new Array($scope.dataPages);
	};

	$scope.nextPage = function() {
		if ($scope.dataPage < $scope.dataPages) {
			$scope.loadPage($scope.dataPage + 1);
		}
	};

	$scope.previousPage = function() {
		if ($scope.dataPage > 1) {
			$scope.loadPage($scope.dataPage - 1);
		}
	};

	$scope.loadPage = function(pageNumber) {
		$scope.dataPage = pageNumber;
		$http.get(api + '/count')
		.then(function(data) {
			$scope.dataCount = data.data;
			$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
			$http.get(api + '?$offset=' + ((pageNumber - 1) * $scope.dataLimit) + '&$limit=' + $scope.dataLimit)
			.then(function(data) {
				$scope.data = data.data;
			});
		});
	};
	$scope.loadPage($scope.dataPage);

	$scope.openNewDialog = function() {
		$scope.actionType = 'new';
		$scope.entity = {};
		toggleEntityModal();
	};

	$scope.openEditDialog = function(entity) {
		$scope.actionType = 'update';
		$scope.entity = entity;
		$scope.entityForm.$valid = true;
		toggleEntityModal();
	};

	$scope.openDeleteDialog = function(entity) {
		$scope.actionType = 'delete';
		$scope.entity = entity;
		toggleEntityModal();
	};

	$scope.close = function() {
		$scope.loadPage($scope.dataPage);
		toggleEntityModal();
	};

	$scope.create = function() {
		if ($scope.entityForm.$valid) {
			$http.post(api, JSON.stringify($scope.entity))
			.then(function(data) {
				$scope.loadPage($scope.dataPage);
				toggleEntityModal();
				$messageHub.messageEntityModified();
			}, function(data) {
				alert(JSON.stringify(data.data));
			});
		}
	};

	$scope.update = function() {
		if ($scope.entityForm.$valid) {
			$http.put(api + '/' + $scope.entity.Id, JSON.stringify($scope.entity))
			.then(function(data) {
				$scope.loadPage($scope.dataPage);
				toggleEntityModal();
				$messageHub.messageEntityModified();
			}, function(data) {
				alert(JSON.stringify(data.data));
			})
		}
	};

	$scope.delete = function() {
		$http.delete(api + '/' + $scope.entity.Id)
		.then(function(data) {
			$scope.loadPage($scope.dataPage);
			toggleEntityModal();
			$messageHub.messageEntityModified();
		}, function(data) {
			alert(JSON.stringify(data));
		});
	};

	$scope.updateCalculatedProperties = function() {
		var entity = $scope.entity;
	};

	$scope.industryOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.industryOptions.length; i ++) {
			if ($scope.industryOptions[i].Id === optionKey) {
				return $scope.industryOptions[i].Name;
			}
		}
		return null;
	};

	$scope.statusOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.statusOptions.length; i ++) {
			if ($scope.statusOptions[i].Id === optionKey) {
				return $scope.statusOptions[i].Name;
			}
		}
		return null;
	};

	$scope.ownerOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.ownerOptions.length; i ++) {
			if ($scope.ownerOptions[i].Id === optionKey) {
				return $scope.ownerOptions[i].LastName;
			}
		}
		return null;
	};

	$messageHub.onEntityRefresh($scope.loadPage($scope.dataPage));
	$messageHub.onIndustryModified(industryOptionsLoad);
	$messageHub.onLeadStatusModified(statusOptionsLoad);
	$messageHub.onEmployeeModified(ownerOptionsLoad);

	$scope.selectEntity = function(entity) {
		$scope.selectedEntity = entity;
		$messageHub.messageEntitySelected({
			'id': entity.Id		})
	};

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});
