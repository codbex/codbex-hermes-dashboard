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
var response = require("http/v4/response");

// HTTP 200
exports.sendResponseOk = function(entity) {
	this.sendResponse(200, entity);
};

// HTTP 201
exports.sendResponseCreated = function(entity) {
	this.sendResponse(201, entity);
};

// HTTP 200
exports.sendResponseNoContent = function() {
	this.sendResponse(204);
};

// HTTP 400
exports.sendResponseBadRequest = function(message) {
	this.sendResponse(404, {
		"code": 400,
		"message": message
	});
};

// HTTP 403
exports.sendForbiddenRequest = function(message) {
	this.sendResponse(403, {
		"code": 403,
		"message": message
	});
};

// HTTP 404
exports.sendResponseNotFound = function(message) {
	this.sendResponse(404, {
		"code": 404,
		"message": message
	});
};

// HTTP 500
exports.sendInternalServerError = function(message) {
	this.sendResponse(500, {
		"code": 500,
		"message": message
	});
};

// Generic
exports.sendResponse = function(status, body) {
	response.setContentType("application/json");
	response.setStatus(status);
	if (body) {
		response.println(JSON.stringify(body));
	}
};