"use strict";
/**
 * @file contains all the routes related to analytics / aggregation of data
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytic_controller_1 = require("../controllers/analytic.controller");
const require_auth_1 = require("../common/middleware/require-auth");
// initialize router
const route = (0, express_1.Router)();
// get the aggregated analytics data for admin dashboard
route.get('/dashboard-admin', (0, require_auth_1.requireAuth)('admin'), analytic_controller_1.dashboardAdminAnalytics);
//export all the routes
exports.default = route;
