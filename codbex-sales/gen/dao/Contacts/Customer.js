var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_CUSTOMER",
	properties: [
		{
			name: "Id",
			column: "CUSTOMER_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Name",
			column: "CUSTOMER_NAME",
			type: "VARCHAR",
		}, {
			name: "Line1",
			column: "CUSTOMER_LINE1",
			type: "VARCHAR",
		}, {
			name: "Line2",
			column: "CUSTOMER_LINE2",
			type: "VARCHAR",
		}, {
			name: "City",
			column: "CUSTOMER_CITY",
			type: "VARCHAR",
		}, {
			name: "County",
			column: "CUSTOMER_COUNTY",
			type: "VARCHAR",
		}, {
			name: "PostalCode",
			column: "CUSTOMER_POSTALCODE",
			type: "VARCHAR",
		}, {
			name: "Email",
			column: "CUSTOMER_EMAIL",
			type: "VARCHAR",
		}, {
			name: "Phone",
			column: "CUSTOMER_PHONE",
			type: "VARCHAR",
		}, {
			name: "Fax",
			column: "CUSTOMER_FAX",
			type: "VARCHAR",
		}, {
			name: "Country",
			column: "CUSTOMER_COUNTRY",
			type: "INTEGER",
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
		table: "CODBEX_CUSTOMER",
		key: {
			name: "Id",
			column: "CUSTOMER_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_CUSTOMER",
		key: {
			name: "Id",
			column: "CUSTOMER_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_CUSTOMER",
		key: {
			name: "Id",
			column: "CUSTOMER_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_CUSTOMER");
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
	producer.queue("codbex-sales/Contacts/Customer/" + operation).send(JSON.stringify(data));
}