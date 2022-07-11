/*
 * Copyright (c) 2022 codbex or an codbex affiliate company and contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: 2022 codbex or an codbex affiliate company and contributors
 * SPDX-License-Identifier: EPL-2.0
 */
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
		messageHub.post({data: data}, 'codbex-hermes.Quotations.QuotationItem.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onEntityRefresh: function(callback) {
			on('codbex-hermes.Quotations.QuotationItem.refresh', callback);
		},
		onQuotationModified: function(callback) {
			on('codbex-hermes.Quotations.Quotation.modified', callback);
		},
		onProductModified: function(callback) {
			on('codbex-hermes.Quotations.Product.modified', callback);
		},
		onUoMModified: function(callback) {
			on('codbex-hermes.Quotations.UoM.modified', callback);
		},
		onCurrencyModified: function(callback) {
			on('codbex-hermes.Quotations.Currency.modified', callback);
		},
		onQuotationSelected: function(callback) {
			on('codbex-hermes.Quotations.Quotation.selected', callback);
		},
		messageEntityModified: function() {
			message('modified');
		}
	};
}])
.controller('PageController', function ($scope, $http, $messageHub) {

	var api = '/services/v4/js/codbex-hermes/gen/api/Quotations/QuotationItem.js';
	var quotationOptionsApi = '/services/v4/js/codbex-hermes/gen/api/Quotations/Quotation.js';
	var productOptionsApi = '/services/v4/js/codbex-hermes/gen/api/Products/Product.js';
	var uomOptionsApi = '/services/v4/js/codbex-hermes/gen/api/Products/UoM.js';
	var currencyOptionsApi = '/services/v4/js/codbex-hermes/gen/api/Products/Currency.js';

	$scope.dateOptions = {
		startingDay: 1
	};
	$scope.dateFormats = ['yyyy/MM/dd', 'dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
	$scope.monthFormats = ['yyyy/MM', 'MMMM-yyyy', 'MM.yyyy', 'MMMM/yyyy'];
	$scope.weekFormats = ['yyyy/w', 'w-yyyy', 'w.yyyy', 'w/yyyy', "w"];
	$scope.dateFormat = $scope.dateFormats[0];
	$scope.monthFormat = $scope.monthFormats[1];
	$scope.weekFormat = $scope.weekFormats[3];

	$scope.quotationOptions = [];

	$scope.productOptions = [];

	$scope.uomOptions = [];

	$scope.currencyOptions = [];

	function quotationOptionsLoad() {
		$http.get(quotationOptionsApi)
		.then(function(data) {
			$scope.quotationOptions = data.data;
		});
	}
	quotationOptionsLoad();

	function productOptionsLoad() {
		$http.get(productOptionsApi)
		.then(function(data) {
			$scope.productOptions = data.data;
		});
	}
	productOptionsLoad();

	function uomOptionsLoad() {
		$http.get(uomOptionsApi)
		.then(function(data) {
			$scope.uomOptions = data.data;
		});
	}
	uomOptionsLoad();

	function currencyOptionsLoad() {
		$http.get(currencyOptionsApi)
		.then(function(data) {
			$scope.currencyOptions = data.data;
		});
	}
	currencyOptionsLoad();

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
			$http.get(api + '?Quotation=' + $scope.masterEntityId + '&$offset=' + ((pageNumber - 1) * $scope.dataLimit) + '&$limit=' + $scope.dataLimit)
			.then(function(data) {
				$scope.data = data.data;
			});
		});
	};

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
			$scope.entity.Quotation = $scope.masterEntityId;
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
			$scope.entity.Quotation = $scope.masterEntityId;

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
		entity["Total"] = entity["Quantity"] * entity["Price"];
	};

	$scope.quotationOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.quotationOptions.length; i ++) {
			if ($scope.quotationOptions[i].Id === optionKey) {
				return $scope.quotationOptions[i].Name;
			}
		}
		return null;
	};
	$scope.productOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.productOptions.length; i ++) {
			if ($scope.productOptions[i].Id === optionKey) {
				return $scope.productOptions[i].Name;
			}
		}
		return null;
	};
	$scope.uomOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.uomOptions.length; i ++) {
			if ($scope.uomOptions[i].Id === optionKey) {
				return $scope.uomOptions[i].Name;
			}
		}
		return null;
	};
	$scope.currencyOptionValue = function(optionKey) {
		for (var i = 0 ; i < $scope.currencyOptions.length; i ++) {
			if ($scope.currencyOptions[i].Code === optionKey) {
				return $scope.currencyOptions[i].Name;
			}
		}
		return null;
	};

	$messageHub.onEntityRefresh($scope.loadPage($scope.dataPage));
	$messageHub.onQuotationModified(quotationOptionsLoad);
	$messageHub.onProductModified(productOptionsLoad);
	$messageHub.onUoMModified(uomOptionsLoad);
	$messageHub.onCurrencyModified(currencyOptionsLoad);

	$messageHub.onQuotationSelected(function(event) {
		$scope.masterEntityId = event.data.id;
		$scope.loadPage($scope.dataPage);
	});

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});
