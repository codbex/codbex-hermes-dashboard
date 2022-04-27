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
		messageHub.post({data: data}, 'codbex-sales.Opportunities.Opportunity.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onEntityRefresh: function(callback) {
			on('codbex-sales.Opportunities.Opportunity.refresh', callback);
		},
		onOpportunityTypeModified: function(callback) {
			on('codbex-sales.Opportunities.OpportunityType.modified', callback);
		},
		onOpportunityStatusModified: function(callback) {
			on('codbex-sales.Opportunities.OpportunityStatus.modified', callback);
		},
		onCustomerModified: function(callback) {
			on('codbex-sales.Opportunities.Customer.modified', callback);
		},
		onEmployeeModified: function(callback) {
			on('codbex-sales.Opportunities.Employee.modified', callback);
		},
		onOpportunityPriorityModified: function(callback) {
			on('codbex-sales.Opportunities.OpportunityPriority.modified', callback);
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

	var api = '/services/v4/js/codbex-sales/gen/api/Opportunities/Opportunity.js';
	var typeOptionsApi = '/services/v4/js/codbex-sales/gen/api/Opportunities/OpportunityType.js';
	var statusOptionsApi = '/services/v4/js/codbex-sales/gen/api/Opportunities/OpportunityStatus.js';
	var customerOptionsApi = '/services/v4/js/codbex-sales/gen/api/Contacts/Customer.js';
	var ownerOptionsApi = '/services/v4/js/codbex-sales/gen/api/Employees/Employee.js';
	var priorityOptionsApi = '/services/v4/js/codbex-sales/gen/api/Opportunities/OpportunityPriority.js';

	$scope.typeOptions = [];

	$scope.statusOptions = [];

	$scope.customerOptions = [];

	$scope.ownerOptions = [];

	$scope.priorityOptions = [];

	$scope.dateOptions = {
		startingDay: 1
	};
	$scope.dateFormats = ['yyyy/MM/dd', 'dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
	$scope.monthFormats = ['yyyy/MM', 'MMMM-yyyy', 'MM.yyyy', 'MMMM/yyyy'];
	$scope.weekFormats = ['yyyy/w', 'w-yyyy', 'w.yyyy', 'w/yyyy', "w"];
	$scope.dateFormat = $scope.dateFormats[0];
	$scope.monthFormat = $scope.monthFormats[1];
	$scope.weekFormat = $scope.weekFormats[3];

	function typeOptionsLoad() {
		$http.get(typeOptionsApi)
		.then(function(data) {
			$scope.typeOptions = data.data;
		});
	}
	typeOptionsLoad();

	function statusOptionsLoad() {
		$http.get(statusOptionsApi)
		.then(function(data) {
			$scope.statusOptions = data.data;
		});
	}
	statusOptionsLoad();

	function customerOptionsLoad() {
		$http.get(customerOptionsApi)
		.then(function(data) {
			$scope.customerOptions = data.data;
		});
	}
	customerOptionsLoad();

	function ownerOptionsLoad() {
		$http.get(ownerOptionsApi)
		.then(function(data) {
			$scope.ownerOptions = data.data;
		});
	}
	ownerOptionsLoad();

	function priorityOptionsLoad() {
		$http.get(priorityOptionsApi)
		.then(function(data) {
			$scope.priorityOptions = data.data;
		});
	}
	priorityOptionsLoad();

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
			$scope.dataCount = data;
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

	$scope.typeOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.typeOptions.length; i ++) {
			if ($scope.typeOptions[i].Id === optionKey) {
				return $scope.typeOptions[i].Name;
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

	$scope.customerOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.customerOptions.length; i ++) {
			if ($scope.customerOptions[i].Id === optionKey) {
				return $scope.customerOptions[i].Name;
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

	$scope.priorityOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.priorityOptions.length; i ++) {
			if ($scope.priorityOptions[i].Id === optionKey) {
				return $scope.priorityOptions[i].Name;
			}
		}
		return null;
	};

	$messageHub.onEntityRefresh($scope.loadPage($scope.dataPage));
	$messageHub.onOpportunityTypeModified(typeOptionsLoad);
	$messageHub.onOpportunityStatusModified(statusOptionsLoad);
	$messageHub.onCustomerModified(customerOptionsLoad);
	$messageHub.onEmployeeModified(ownerOptionsLoad);
	$messageHub.onOpportunityPriorityModified(priorityOptionsLoad);

	$scope.selectEntity = function(entity) {
		$scope.selectedEntity = entity;
		$messageHub.messageEntitySelected({
			'id': entity.Id		})
	};

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});
