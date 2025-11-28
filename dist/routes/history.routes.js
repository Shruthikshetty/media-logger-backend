"use strict";
/**
 * This @file contains the routes for history
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const require_auth_1 = require("../common/middleware/require-auth");
const history_controller_1 = require("../controllers/history.controller");
const handle_validation_1 = require("../common/middleware/handle-validation");
const history_filter_1 = require("../common/validation-schema/history/history-filter");
//initialize router
const route = (0, express_1.Router)();
/**
 * @swagger
 * /api/history:
 *   get:
 *     tags: [History]
 *     summary: Get all history records, including media type add, update and delete operations, as well as user deletes and permission updates performed by administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         default: 20
 *         schema:
 *           type: integer
 *         required: false
 *       - name: page
 *         in: query
 *         default: 1
 *         schema:
 *           type: integer
 *         required: false
 *       - name: start
 *         default: 0
 *         in: query
 *         schema:
 *           type: integer
 *         required: false
 *       - name: fullDetails
 *         in: query
 *         required: false
 *         default: false
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllHistorySuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/', (0, require_auth_1.requireAuth)('admin'), history_controller_1.getAllHistory);
/**
 * @swagger
 * /api/history/filter:
 *   post:
 *     summary: Get history by filters
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/FilterHistoryRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllHistorySuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/filter', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(history_filter_1.HistoryFilterZodSchema), history_controller_1.getHistoryByFilters);
//export all the routes
exports.default = route;
