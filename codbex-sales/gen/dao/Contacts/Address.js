var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_ADDRESS",
	properties: [
		{
			name: "Id",
			column: "ADDRESS_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Name",
			column: "ADDRESS_NAME",
			type: "VARCHAR",
		}, {
			name: "Line1",
			column: "ADDRESS_LINE1",
			type: "VARCHAR",
		}, {
			name: "Line2",
			column: "ADDRESS_LINE2",
			type: "VARCHAR",
		}, {
			name: "Line3",
			column: "ADDRESS_LINE3",
			type: "VARCHAR",
		}, {
			name: "City",
			column: "ADDRESS_CITY",
			type: "VARCHAR",
		}, {
			name: "County",
			column: "ADDRESS_COUNTY",
			type: "VARCHAR",
		}, {
			name: "Province",
			column: "ADDRESS_PROVINCE",
			type: "VARCHAR",
		}, {
			name: "PostalCode",
			column: "ADDRESS_POSTALCODE",
			type: "VARCHAR",
		}, {
			name: "Email",
			column: "ADDRESS_EMAIL",
			type: "VARCHAR",
		}, {
			name: "Phone",
			column: "ADDRESS_PHONE",
			type: "VARCHAR",
		}, {
			name: "Fax",
			column: "ADDRESS_FAX",
			type: "VARCHAR",
		}, {
			name: "Country",
			column: "ADDRESS_COUNTRY",
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
		table: "CODBEX_ADDRESS",
		key: {
			name: "Id",
			column: "ADDRESS_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_ADDRESS",
		key: {
			name: "Id",
			column: "ADDRESS_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_ADDRESS",
		key: {
			name: "Id",
			column: "ADDRESS_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_ADDRESS");
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
	producer.queue("codbex-sales/Contacts/Address/" + operation).send(JSON.stringify(data));
}