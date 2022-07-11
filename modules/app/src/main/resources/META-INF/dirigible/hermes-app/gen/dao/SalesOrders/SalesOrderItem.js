var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_SALESORDERITEM",
	properties: [
		{
			name: "Id",
			column: "SALESORDERITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "SalesOrder",
			column: "SALESORDERITEM_SALESORDER",
			type: "INTEGER",
		}, {
			name: "Product",
			column: "SALESORDERITEM_PRODUCT",
			type: "INTEGER",
		}, {
			name: "UoM",
			column: "SALESORDERITEM_UOM",
			type: "INTEGER",
		}, {
			name: "Quantity",
			column: "SALESORDERITEM_QUANTITY",
			type: "DOUBLE",
		}, {
			name: "Price",
			column: "SALESORDERITEM_PRICE",
			type: "DOUBLE",
		}, {
			name: "Total",
			column: "SALESORDERITEM_TOTAL",
			type: "DOUBLE",
		}, {
			name: "Currency",
			column: "SALESORDERITEM_CURRENCY",
			type: "CHAR",
		}, {
			name: "Name",
			column: "CODBEX_SALESORDERITEM_NAME",
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
	entity["Name"] = entity["SalesOrder"] + ' ' + entity["Product"];
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_SALESORDERITEM",
		key: {
			name: "Id",
			column: "SALESORDERITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	entity["Name"] = entity["SalesOrder"] + ' ' + entity["Product"]
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_SALESORDERITEM",
		key: {
			name: "Id",
			column: "SALESORDERITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_SALESORDERITEM",
		key: {
			name: "Id",
			column: "SALESORDERITEM_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_SALESORDERITEM");
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
	producer.queue("hermes-app/SalesOrders/SalesOrderItem/" + operation).send(JSON.stringify(data));
}