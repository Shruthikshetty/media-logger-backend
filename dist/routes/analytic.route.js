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
/**
 * @swagger
 * /api/analytic/dashboard-admin:
 *   get:
 *     summary: Get aggregated analytics data for admin dashboard
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDashboardAdminAnalyticsSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/dashboard-admin', (0, require_auth_1.requireAuth)('admin'), analytic_controller_1.dashboardAdminAnalytics);
//export all the routes
exports.default = route;
