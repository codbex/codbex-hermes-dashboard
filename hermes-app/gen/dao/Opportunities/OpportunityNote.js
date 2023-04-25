const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_OPPORTUNITYNOTE",
	properties: [
		{
			name: "Id",
			column: "OPPORTUNITYNOTE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Type",
			column: "OPPORTUNITYNOTE_TYPE",
			type: "INTEGER",
		},
 {
			name: "Opportunity",
			column: "OPPORTUNITYNOTE_OPPORTUNITY",
			type: "INTEGER",
		},
 {
			name: "Note",
			column: "OPPORTUNITYNOTE_NOTE",
			type: "VARCHAR",
		},
 {
			name: "Timestamp",
			column: "OPPORTUNITYNOTE_TIMESTAMP",
			type: "TIMESTAMP",
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
		table: "CODBEX_OPPORTUNITYNOTE",
		key: {
			name: "Id",
			column: "OPPORTUNITYNOTE_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_OPPORTUNITYNOTE",
		key: {
			name: "Id",
			column: "OPPORTUNITYNOTE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_OPPORTUNITYNOTE",
		key: {
			name: "Id",
			column: "OPPORTUNITYNOTE_ID",
			value: id
		}
	});
};

exports.count = function (Opportunity) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYNOTE" WHERE "OPPORTUNITYNOTE_OPPORTUNITY" = ?', [Opportunity]);
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYNOTE"');
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
	producer.queue("hermes-app/Opportunities/OpportunityNote/" + operation).send(JSON.stringify(data));
}