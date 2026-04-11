"use strict";
/**
 * This @file contains all the routes related to media entry
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_entry_controller_1 = require("../controllers/media-entry.controller");
const require_auth_1 = require("../common/middleware/require-auth");
const handle_validation_1 = require("../common/middleware/handle-validation");
const add_media_entry_1 = require("../common/validation-schema/media-entry/add-media-entry");
const update_media_entry_1 = require("../common/validation-schema/media-entry/update-media-entry");
const filter_media_entry_1 = require("../common/validation-schema/media-entry/filter-media-entry");
//initialize router
const route = (0, express_1.Router)();
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
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/', (0, require_auth_1.requireAuth)(), (0, handle_validation_1.validateReq)(add_media_entry_1.AddMediaEntrySchema), media_entry_controller_1.addNewMediaEntry);
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
route.post('/filter', (0, require_auth_1.requireAuth)(), (0, handle_validation_1.validateReq)(filter_media_entry_1.FilterMediaEntrySchema), media_entry_controller_1.getUserMediaEntriesWithFilters);
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
route.get('/', (0, require_auth_1.requireAuth)(), media_entry_controller_1.getAllUserMediaEntries);
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
route.get('/by-media', (0, require_auth_1.requireAuth)(), media_entry_controller_1.getMediaEntryByMedia);
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
route.get('/:id', (0, require_auth_1.requireAuth)(), media_entry_controller_1.getMediaEntryById);
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
route.patch('/:id', (0, require_auth_1.requireAuth)(), (0, handle_validation_1.validateReq)(update_media_entry_1.UpdateMediaEntrySchema), media_entry_controller_1.updateUserMediaEntry);
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
route.delete('/:id', (0, require_auth_1.requireAuth)(), media_entry_controller_1.deleteUserMediaEntry);
//export all the routes
exports.default = route;
