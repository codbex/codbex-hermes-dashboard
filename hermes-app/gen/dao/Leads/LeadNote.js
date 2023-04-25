const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_LEADNOTE",
	properties: [
		{
			name: "Id",
			column: "LEADNOTE_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Type",
			column: "LEADNOTE_NOTETYPEID",
			type: "INTEGER",
		},
 {
			name: "Lead",
			column: "LEADNOTE_LEAD",
			type: "INTEGER",
		},
 {
			name: "Note",
			column: "LEADNOTE_NOTE",
			type: "VARCHAR",
		},
 {
			name: "Timestamp",
			column: "LEADNOTE_TIMESTAMP",
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
		table: "CODBEX_LEADNOTE",
		key: {
			name: "Id",
			column: "LEADNOTE_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_LEADNOTE",
		key: {
			name: "Id",
			column: "LEADNOTE_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_LEADNOTE",
		key: {
			name: "Id",
			column: "LEADNOTE_ID",
			value: id
		}
	});
};

exports.count = function (Lead) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADNOTE" WHERE "LEADNOTE_LEAD" = ?', [Lead]);
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
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADNOTE"');
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
	producer.queue("hermes-app/Leads/LeadNote/" + operation).send(JSON.stringify(data));
}