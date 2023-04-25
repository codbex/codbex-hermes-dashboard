const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_EMPLOYEE",
	properties: [
		{
			name: "Id",
			column: "EMPLOYEE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "FirstName",
			column: "EMPLOYEE_FIRSTNAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "MiddleName",
			column: "EMPLOYEE_MIDDLENAME",
			type: "VARCHAR",
		},
 {
			name: "LastName",
			column: "EMPLOYEE_LASTNAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Identifier",
			column: "EMPLOYEE_IDENTIFIER",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Email",
			column: "EMPLOYEE_EMAIL",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Phone",
			column: "EMPLOYEE_PHONE",
			type: "VARCHAR",
		},
 {
			name: "Manager",
			column: "EMPLOYEE_MANAGER",
			type: "INTEGER",
		},
 {
			name: "Organisation",
			column: "EMPLOYEE_ORGANISATIONID",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
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
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_EMPLOYEE"');
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
	producer.queue("hermes-app/Employees/Employee/" + operation).send(JSON.stringify(data));
}