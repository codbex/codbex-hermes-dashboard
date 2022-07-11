/*
 * Copyright (c) 2010-2021 SAP and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 * Contributors:
 * SAP - initial API and implementation
 */

var dao = require("hermes-app/gen/dao/Products/Product.js")

exports.getTile = function(relativePath) {
	let count = "n/a";
	try {
		count = dao.customDataCount();	
	} catch (e) {
		console.error("Error occured while involking 'hermes-app/gen/dao/Products/Product.customDataCount()': " + e);
	}
	return {
		name: "Product",
		group: "Products",
		icon: "cubes",
		location: relativePath + "services/v4/web/hermes-app/gen/ui/Products/index.html",
		count: count,
		order: "700"
	};
};
