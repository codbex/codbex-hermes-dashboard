/*
 * Copyright (c) 2010-2021 SAP and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 * Contributors:
 * SAP - initial API and implementation
 */

var dao = require("codbex-sales/gen/dao/Quotations/Quotation.js")

exports.getTile = function(relativePath) {
	let count = "n/a";
	try {
		count = dao.customDataCount();	
	} catch (e) {
		console.error("Error occured while involking 'codbex-sales/gen/dao/Quotations/Quotation.customDataCount()': " + e);
	}
	return {
		name: "Quotation",
		group: "Quotations",
		icon: "file-text-o",
		location: relativePath + "services/v4/web/codbex-sales/gen/ui/Quotations/index.html",
		count: count,
		order: "300"
	};
};
