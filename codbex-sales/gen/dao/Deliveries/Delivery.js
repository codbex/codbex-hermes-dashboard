var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");
var EntityUtils = require("codbex-sales/gen/dao/utils/EntityUtils");

var dao = daoApi.create({
	table: "CODBEX_DELIVERY",
	properties: [
		{
			name: "Id",
			column: "DELIVERY_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Initiated",
			column: "DELIVERY_INITIATED",
			type: "TIMESTAMP",
		}, {
			name: "ETA",
			column: "DELIVERY_ETA",
			type: "DATE",
		}, {
			name: "SalesOrderItem",
			column: "DELIVERY_SALESORDERITEM",
			type: "INTEGER",
		}, {
			name: "DeliveryStatus",
			column: "DELIVERY_DELIVERYSTATUS",
			type: "INTEGER",
		}]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setLocalDate(e, "ETA");
		return e;
	});
};

exports.get = function(id) {
	var entity = dao.find(id);
	EntityUtils.setLocalDate(entity, "ETA");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "ETA");
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_DELIVERY",
		key: {
			name: "Id",
			column: "DELIVERY_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setLocalDate(entity, "ETA");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_DELIVERY",
		key: {
			name: "Id",
			column: "DELIVERY_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_DELIVERY",
		key: {
			name: "Id",
			column: "DELIVERY_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_DELIVERY");
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
	producer.queue("codbex-sales/Deliveries/Delivery/" + operation).send(JSON.stringify(data));
}