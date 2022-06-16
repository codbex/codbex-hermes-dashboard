var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");
var EntityUtils = require("codbex-hermes/gen/dao/utils/EntityUtils");

var dao = daoApi.create({
	table: "CODBEX_SALESINVOICE",
	properties: [
		{
			name: "Id",
			column: "SALESINVOICE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Name",
			column: "SALESINVOICE_NAME",
			type: "VARCHAR",
		}, {
			name: "Date",
			column: "SALESINVOICE_DATE",
			type: "DATE",
		}, {
			name: "Number",
			column: "SALESINVOICE_NUMBER",
			type: "VARCHAR",
		}, {
			name: "Owner",
			column: "SALESINVOICE_OWNER",
			type: "INTEGER",
		}, {
			name: "Customer",
			column: "SALESINVOICE_CUSTOMER",
			type: "INTEGER",
		}, {
			name: "SalesOrder",
			column: "SALESINVOICE_SALESORDER",
			type: "INTEGER",
		}, {
			name: "Total",
			column: "SALESINVOICE_TOTAL",
			type: "DOUBLE",
		}, {
			name: "Currency",
			column: "SALESINVOICE_CURRENCY",
			type: "CHAR",
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
		table: "CODBEX_SALESINVOICE",
		key: {
			name: "Id",
			column: "SALESINVOICE_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_SALESINVOICE",
		key: {
			name: "Id",
			column: "SALESINVOICE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_SALESINVOICE",
		key: {
			name: "Id",
			column: "SALESINVOICE_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_SALESINVOICE");
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
	producer.queue("codbex-hermes/SalesInvoices/SalesInvoice/" + operation).send(JSON.stringify(data));
}