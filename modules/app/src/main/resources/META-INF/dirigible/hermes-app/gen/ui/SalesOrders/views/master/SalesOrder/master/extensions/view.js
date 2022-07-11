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
exports.getView = function(relativePath) {
	return {
		id: "SalesOrder",
		name: "SalesOrder",
		label: "SalesOrder",
		order: 100,
		factory: "frame",
		region: "center-top",
		type: "master",
		link: relativePath + "services/v4/web/codbex-hermes/gen/ui/SalesOrders/views/master/SalesOrder/master/index.html"
	};
};
