var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");
var EntityUtils = require("hermes-app/gen/dao/utils/EntityUtils");

var dao = daoApi.create({
	table: "CODBEX_QUOTATION",
	properties: [
		{
			name: "Id",
			column: "QUOTATION_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Name",
			column: "QUOTATION_NAME",
			type: "VARCHAR",
		}, {
			name: "Date",
			column: "QUOTATION_DATE",
			type: "DATE",
		}, {
			name: "Number",
			column: "QUOTATION_NUMBER",
			type: "VARCHAR",
		}, {
			name: "Owner",
			column: "QUOTATION_OWNER",
			type: "INTEGER",
		}, {
			name: "Customer",
			column: "QUOTATION_CUSTOMER",
			type: "INTEGER",
		}, {
			name: "Total",
			column: "QUOTATION_TOTAL",
			type: "DOUBLE",
		}, {
			name: "Currency",
			column: "QUOTATION_CURRENCYCODE",
			type: "CHAR",
		}, {
			name: "Opportunity",
			column: "QUOTATION_OPPORTUNITY",
			type: "INTEGER",
		}, {
			name: "Status",
			column: "QUOTATION_STATUS",
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
		table: "CODBEX_QUOTATION",
		key: {
			name: "Id",
			column: "QUOTATION_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_QUOTATION",
		key: {
			name: "Id",
			column: "QUOTATION_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_QUOTATION",
		key: {
			name: "Id",
			column: "QUOTATION_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_QUOTATION");
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
	producer.queue("hermes-app/Quotations/Quotation/" + operation).send(JSON.stringify(data));
}