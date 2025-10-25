"use strict";
/**
 * This @file contains the routes for history
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const require_auth_1 = require("../common/middleware/require-auth");
const history_controller_1 = require("../controllers/history.controller");
//initialize router
const route = (0, express_1.Router)();
// route to get all history with pagination
route.get('/', (0, require_auth_1.requireAuth)('admin'), history_controller_1.getAllHistory);
//export all the routes
exports.default = route;
