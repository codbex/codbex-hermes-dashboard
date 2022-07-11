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
var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");
var EntityUtils = require("codbex-hermes/gen/dao/utils/EntityUtils");

var dao = daoApi.create({
	table: "CODBEX_SALESORDER",
	properties: [
		{
			name: "Id",
			column: "SALESORDER_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Name",
			column: "SALESORDER_NAME",
			type: "VARCHAR",
		}, {
			name: "Date",
			column: "SALESORDER_DATE",
			type: "DATE",
		}, {
			name: "Number",
			column: "SALESORDER_NUMBER",
			type: "VARCHAR",
		}, {
			name: "Owner",
			column: "SALESORDER_OWNER",
			type: "INTEGER",
		}, {
			name: "Customer",
			column: "SALESORDER_CUSTOMER",
			type: "INTEGER",
		}, {
			name: "Total",
			column: "SALESORDER_TOTAL",
			type: "DOUBLE",
		}, {
			name: "Currency",
			column: "SALESORDER_CURRENCY",
			type: "CHAR",
		}, {
			name: "Quotation",
			column: "SALESORDER_QUOTATION",
			type: "INTEGER",
		}]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setLocalDate(e, "Date");
		return e;
	});
};

exports.get = function(id) {
	var entity = dao.find(id);
	EntityUtils.setLocalDate(entity, "Date");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_SALESORDER",
		key: {
			name: "Id",
			column: "SALESORDER_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_SALESORDER",
		key: {
			name: "Id",
			column: "SALESORDER_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_SALESORDER",
		key: {
			name: "Id",
			column: "SALESORDER_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_SALESORDER");
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-hermes/SalesOrders/SalesOrder/" + operation).send(JSON.stringify(data));
}