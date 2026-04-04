/**
 * This @file contains the routes for history
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import {
  getAllHistory,
  getHistoryByFilters,
  getHistoryById,
} from '../controllers/history.controller';
import { validateReq } from '../common/middleware/handle-validation';
import { HistoryFilterZodSchema } from '../common/validation-schema/history/history-filter';

//initialize router
const route = Router();

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
route.get('/', requireAuth('admin'), getAllHistory);

/**
 * @swagger
 * /api/history/{id}:
 *   get:
 *     tags: [History]
 *     summary: Get a history record by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *       - name: fullDetails
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetSingleHistorySuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/:id', requireAuth('admin'), getHistoryById);

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
route.post(
  '/filter',
  requireAuth('admin'),
  validateReq(HistoryFilterZodSchema),
  getHistoryByFilters
);

//export all the routes
export default route;
