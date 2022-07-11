/*
 * Copyright (c) 2022 codbex or an codbex affiliate company and contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: 2022 codbex or an codbex affiliate company and contributors
 * SPDX-License-Identifier: EPL-2.0
 */
var dao = require("codbex-hermes/gen/dao/Deliveries/DeliveryStatus.js")

exports.getTile = function(relativePath) {
	let count = "n/a";
	try {
		count = dao.customDataCount();	
	} catch (e) {
		console.error("Error occured while involking 'codbex-hermes/gen/dao/Deliveries/DeliveryStatus.customDataCount()': " + e);
	}
	return {
		name: "DeliveryStatus",
		group: "Deliveries",
		icon: "asterisk",
		location: relativePath + "services/v4/web/codbex-hermes/gen/ui/Deliveries/index.html",
		count: count,
		order: "600"
	};
};
