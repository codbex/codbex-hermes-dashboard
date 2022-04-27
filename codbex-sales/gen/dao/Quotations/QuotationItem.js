var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_QUOTATIONITEM",
	properties: [
		{
			name: "Id",
			column: "QUOTATIONITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Quotation",
			column: "QUOTATIONITEM_QUOTATION",
			type: "INTEGER",
		}, {
			name: "Product",
			column: "QUOTATIONITEM_PRODUCT",
			type: "INTEGER",
		}, {
			name: "UoM",
			column: "QUOTATIONITEM_UOM",
			type: "INTEGER",
		}, {
			name: "Quantity",
			column: "QUOTATIONITEM_QUANTITY",
			type: "DOUBLE",
		}, {
			name: "Price",
			column: "QUOTATIONITEM_PRICE",
			type: "DOUBLE",
		}, {
			name: "Total",
			column: "QUOTATIONITEM_TOTAL",
			type: "DOUBLE",
		}, {
			name: "Currency",
			column: "QUOTATIONITEM_CURRENCY",
			type: "CHAR",
		}]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	entity["Total"] = Quantity * Price;
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_QUOTATIONITEM",
		key: {
			name: "Id",
			column: "QUOTATIONITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	entity["Total"] = Quantity * Price
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_QUOTATIONITEM",
		key: {
			name: "Id",
			column: "QUOTATIONITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_QUOTATIONITEM",
		key: {
			name: "Id",
			column: "QUOTATIONITEM_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_QUOTATIONITEM");
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
	producer.queue("codbex-sales/Quotations/QuotationItem/" + operation).send(JSON.stringify(data));
}