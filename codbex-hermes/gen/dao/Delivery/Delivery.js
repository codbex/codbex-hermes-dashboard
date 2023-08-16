const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-hermes/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_DELIVERY",
	properties: [
		{
			name: "Id",
			column: "DELIVERY_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Iniitiated",
			column: "DELIVERY_INIITIATED",
			type: "TIMESTAMP",
		},
 {
			name: "ETA",
			column: "DELIVERY_ETA",
			type: "DATE",
		},
 {
			name: "DeliveryStatusId",
			column: "DELIVERY_DELIVERYSTATUSID",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "ETA");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "ETA");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "ETA");
	let id = dao.insert(entity);
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
	// EntityUtils.setLocalDate(entity, "ETA");
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
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_DELIVERY"');
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
	producer.queue("codbex-hermes/Delivery/Delivery/" + operation).send(JSON.stringify(data));
}