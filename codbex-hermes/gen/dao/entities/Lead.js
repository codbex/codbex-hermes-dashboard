const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_LEAD",
	properties: [
		{
			name: "Id",
			column: "ENTITY7_ENTITY7ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "ENTITY7_PROPERTY2",
			type: "VARCHAR",
		},
 {
			name: "CompanyName",
			column: "ENTITY7_PROPERTY3",
			type: "VARCHAR",
		},
 {
			name: "ContactName",
			column: "ENTITY7_PROPERTY4",
			type: "VARCHAR",
		},
 {
			name: "ContactDesignation",
			column: "ENTITY7_PROPERTY5",
			type: "VARCHAR",
		},
 {
			name: "ContactEmail",
			column: "ENTITY7_PROPERTY6",
			type: "VARCHAR",
		},
 {
			name: "ContactPhone",
			column: "ENTITY7_PROPERTY7",
			type: "VARCHAR",
		},
 {
			name: "Industry",
			column: "ENTITY7_INDUSTRYID",
			type: "INTEGER",
		},
 {
			name: "LeadStatus",
			column: "ENTITY7_LEADSTATUSID",
			type: "INTEGER",
		},
 {
			name: "Owner",
			column: "ENTITY7_OWNER",
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
		table: "CODBEX_LEAD",
		key: {
			name: "Id",
			column: "ENTITY7_ENTITY7ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_LEAD",
		key: {
			name: "Id",
			column: "ENTITY7_ENTITY7ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_LEAD",
		key: {
			name: "Id",
			column: "ENTITY7_ENTITY7ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ENTITY7"');
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
	producer.queue("codbex-hermes/entities/Lead/" + operation).send(JSON.stringify(data));
}