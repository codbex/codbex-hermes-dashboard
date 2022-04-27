var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "CODBEX_LEAD",
	properties: [
		{
			name: "Id",
			column: "LEAD_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Name",
			column: "LEAD_NAME",
			type: "VARCHAR",
		}, {
			name: "CompanyName",
			column: "LEAD_COMPANYNAME",
			type: "VARCHAR",
		}, {
			name: "ContactName",
			column: "LEAD_CONTACTNAME",
			type: "VARCHAR",
		}, {
			name: "ContactDesignation",
			column: "LEAD_CONTACTDESIGNATION",
			type: "VARCHAR",
		}, {
			name: "ContactEmail",
			column: "LEAD_CONTACTEMAIL",
			type: "VARCHAR",
		}, {
			name: "ContactPhone",
			column: "LEAD_CONTACTPHONE",
			type: "VARCHAR",
		}, {
			name: "Industry",
			column: "LEAD_INDUSTRY",
			type: "INTEGER",
		}, {
			name: "Status",
			column: "LEAD_LEADSTATUS",
			type: "INTEGER",
		}, {
			name: "Owner",
			column: "LEAD_OWNER",
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
		table: "CODBEX_LEAD",
		key: {
			name: "Id",
			column: "LEAD_ID",
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
			column: "LEAD_ID",
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
			column: "LEAD_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CODBEX_LEAD");
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
	producer.queue("codbex-sales/Leads/Lead/" + operation).send(JSON.stringify(data));
}