var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_DELIVERYEVENT",
	properties: [
		{
			name: "Id",
			column: "DELIVERYEVENT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Delivery",
			column: "DELIVERYEVENT_DELIVERY",
			type: "INTEGER",
		}, {
			name: "Timestamp",
			column: "DELIVERYEVENT_TIMESTAMP",
			type: "VARCHAR",
		}, {
			name: "Note",
			column: "DELIVERYEVENT_NOTE",
			type: "VARCHAR",
		}]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_DELIVERYEVENT",
		key: {
			name: "Id",
			column: "DELIVERYEVENT_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_DELIVERYEVENT",
		key: {
			name: "Id",
			column: "DELIVERYEVENT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_DELIVERYEVENT",
		key: {
			name: "Id",
			column: "DELIVERYEVENT_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_DELIVERYEVENT");
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
	producer.queue("hermes-app/Deliveries/DeliveryEvent/" + operation).send(JSON.stringify(data));
}