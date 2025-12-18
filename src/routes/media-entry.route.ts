/**
 * This @file contains all the routes related to media entry
 */

import { Router } from 'express';
import {
  addNewMediaEntry,
  getAllUserMediaEntries,
  updateUserMediaEntry,
  deleteUserMediaEntry,
  getMediaEntryById,
  getMediaEntryByMedia,
  getUserMediaEntriesWithFilters,
} from '../controllers/media-entry.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMediaEntrySchema } from '../common/validation-schema/media-entry/add-media-entry';
import { UpdateMediaEntrySchema } from '../common/validation-schema/media-entry/update-media-entry';
import { FilterMediaEntrySchema } from '../common/validation-schema/media-entry/filter-media-entry';

//initialize router
const route = Router();

/**
 * @swagger
 * /api/media-entry:
 *   post:
 *     tags: [Media Entries]
 *     summary: Create a new media entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddMediaEntryRequest'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/AddMediaEntrySuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post(
  '/',
  requireAuth(),
  validateReq(AddMediaEntrySchema),
  addNewMediaEntry
);

/**
 * @swagger
 * /api/media-entry/filter:
 *   post:
 *     tags: [Media Entries]
 *     summary: Get user media entries with filters
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/FilterMediaEntryRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllUserMediaEntriesSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post(
  '/filter',
  requireAuth(),
  validateReq(FilterMediaEntrySchema),
  getUserMediaEntriesWithFilters
);

/**
 * @swagger
 * /api/media-entry:
 *   get:
 *      summary: Get all user media entries with pagination
 *      tags: [Media Entries]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: limit
 *          in: query
 *          require: false
 *          type: integer
 *          default: 20
 *        - name: page
 *          in: query
 *          require: false
 *          type: integer
 *          default: 20
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/GetAllUserMediaEntriesSuccessResponse'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 */
route.get('/', requireAuth(), getAllUserMediaEntries);

/**
 * @swagger
 * /api/media-entry/by-media:
 *   get:
 *     tags: [Media Entries]
 *     summary: Get media entries by mediaItem , onModel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: mediaItem
 *         in: query
 *         required: true
 *         type: string
 *       - name: onModel
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetSingleMediaEntrySuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/by-media', requireAuth(), getMediaEntryByMedia);

/**
 * @swagger
 * /api/media-entry/{id}:
 *   get:
 *     tags: [Media Entries]
 *     summary: Get a media entry by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetSingleMediaEntrySuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/:id', requireAuth(), getMediaEntryById);

/**
 * @swagger
 * /api/media-entry/{id}:
 *   patch:
 *     summary: Update a media entry by id
 *     tags: [Media Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateMediaEntryRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateMediaEntrySuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.patch(
  '/:id',
  requireAuth(),
  validateReq(UpdateMediaEntrySchema),
  updateUserMediaEntry
);

/**
 * @swagger
 * /api/media-entry/{id}:
 *   delete:
 *     tags: [Media Entries]
 *     summary: Delete a media entry by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteMediaEntrySuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/:id', requireAuth(), deleteUserMediaEntry);

//export all the routes
export default route;
