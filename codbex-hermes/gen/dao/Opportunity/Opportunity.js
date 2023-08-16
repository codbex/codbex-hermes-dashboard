const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_OPPORTUNITY",
	properties: [
		{
			name: "Id",
			column: "OPPORTUNITY_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "OPPORTUNITY_NAME",
			type: "VARCHAR",
		},
 {
			name: "Source",
			column: "OPPORTUNITY_SOURCE",
			type: "VARCHAR",
		},
 {
			name: "Customer",
			column: "OPPORTUNITY_CUSTOMER",
			type: "INTEGER",
		},
 {
			name: "Amount",
			column: "OPPORTUNITY_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Lead",
			column: "OPPORTUNITY_LEAD",
			type: "INTEGER",
		},
 {
			name: "Owner",
			column: "OPPORTUNITY_OWNER",
			type: "INTEGER",
		},
 {
			name: "Type",
			column: "OPPORTUNITY_OPPORTUNITYTYPE",
			type: "INTEGER",
		},
 {
			name: "Status",
			column: "OPPORTUNITY_OPPORTUNITYSTATUS",
			type: "INTEGER",
		},
 {
			name: "Priority",
			column: "OPPORTUNITY_OPPORTUNITYPRIORITY",
			type: "INTEGER",
		},
 {
			name: "Probability",
			column: "OPPORTUNITY_OPPORTUNITYPROBABILITY",
			type: "INTEGER",
		},
 {
			name: "CurrencyCode",
			column: "OPPORTUNITY_CURRENCYCODE",
			type: "VARCHAR",
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
		table: "CODBEX_OPPORTUNITY",
		key: {
			name: "Id",
			column: "OPPORTUNITY_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_OPPORTUNITY",
		key: {
			name: "Id",
			column: "OPPORTUNITY_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_OPPORTUNITY",
		key: {
			name: "Id",
			column: "OPPORTUNITY_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITY"');
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
	producer.queue("codbex-hermes/Opportunity/Opportunity/" + operation).send(JSON.stringify(data));
}