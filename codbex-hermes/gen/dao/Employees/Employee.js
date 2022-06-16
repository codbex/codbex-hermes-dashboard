var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_EMPLOYEE",
	properties: [
		{
			name: "Id",
			column: "EMPLOYEE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "FirstName",
			column: "EMPLOYEE_FIRSTNAME",
			type: "VARCHAR",
			required: true
		}, {
			name: "MiddleName",
			column: "EMPLOYEE_MIDDLENAME",
			type: "VARCHAR",
		}, {
			name: "LastName",
			column: "EMPLOYEE_LASTNAME",
			type: "VARCHAR",
			required: true
		}, {
			name: "Identifier",
			column: "EMPLOYEE_IDENTIFIER",
			type: "VARCHAR",
			required: true
		}, {
			name: "Email",
			column: "EMPLOYEE_EMAIL",
			type: "VARCHAR",
			required: true
		}, {
			name: "Phone",
			column: "EMPLOYEE_PHONE",
			type: "VARCHAR",
		}, {
			name: "Manager",
			column: "EMPLOYEE_MANAGER",
			type: "INTEGER",
		}, {
			name: "Organisation",
			column: "EMPLOYEE_ORGANISATIONID",
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
		table: "CODBEX_EMPLOYEE",
		key: {
			name: "Id",
			column: "EMPLOYEE_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_EMPLOYEE",
		key: {
			name: "Id",
			column: "EMPLOYEE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_EMPLOYEE",
		key: {
			name: "Id",
			column: "EMPLOYEE_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_EMPLOYEE");
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
	producer.queue("codbex-hermes/Employees/Employee/" + operation).send(JSON.stringify(data));
}