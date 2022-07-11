var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_CONTACT",
	properties: [
		{
			name: "Id",
			column: "CONTACT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "FirstName",
			column: "CONTACT_FIRSTNAME",
			type: "VARCHAR",
		}, {
			name: "MiddleName",
			column: "CONTACT_MIDDLENAME",
			type: "VARCHAR",
		}, {
			name: "LastName",
			column: "CONTACT_LASTNAME",
			type: "VARCHAR",
		}, {
			name: "Customer",
			column: "CONTACT_CUSTOMERID",
			type: "INTEGER",
		}, {
			name: "Active",
			column: "CONTACT_ACTIVE",
			type: "INTEGER",
		}, {
			name: "Note",
			column: "CODBEX_CONTACT_NOTE",
			type: "VARCHAR",
		}, {
			name: "Line1",
			column: "CONTACT_LINE1",
			type: "VARCHAR",
		}, {
			name: "Line2",
			column: "CONTACT_LINE2",
			type: "VARCHAR",
		}, {
			name: "City",
			column: "CONTACT_CITY",
			type: "VARCHAR",
		}, {
			name: "County",
			column: "CONTACT_COUNTY",
			type: "VARCHAR",
		}, {
			name: "PostalCode",
			column: "CONTACT_POSTALCODE",
			type: "VARCHAR",
		}, {
			name: "Email",
			column: "CONTACT_EMAIL",
			type: "VARCHAR",
		}, {
			name: "Phone",
			column: "CONTACT_PHONE",
			type: "VARCHAR",
		}, {
			name: "Fax",
			column: "CONTACT_FAX",
			type: "VARCHAR",
		}, {
			name: "Country",
			column: "CONTACT_COUNTRY",
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
		table: "CODBEX_CONTACT",
		key: {
			name: "Id",
			column: "CONTACT_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_CONTACT",
		key: {
			name: "Id",
			column: "CONTACT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_CONTACT",
		key: {
			name: "Id",
			column: "CONTACT_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_CONTACT");
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
	producer.queue("hermes-app/Contacts/Contact/" + operation).send(JSON.stringify(data));
}