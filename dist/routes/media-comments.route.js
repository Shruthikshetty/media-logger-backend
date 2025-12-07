"use strict";
/**
 * This @file contains all the routes for media comments
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_comment_controller_1 = require("../controllers/media-comment.controller");
const require_auth_1 = require("../common/middleware/require-auth");
const handle_validation_1 = require("../common/middleware/handle-validation");
const add_comment_1 = require("../common/validation-schema/media-comment/add-comment");
const update_comment_1 = require("../common/validation-schema/media-comment/update-comment");
//initialize router
const route = (0, express_1.Router)();
/**
 * @swagger
 * /api/media-comment:
 *   post:
 *     tags: [Media Comments]
 *     summary: Create a new media comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddMediaCommentRequest'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/AddMediaCommentSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/', (0, require_auth_1.requireAuth)(), (0, handle_validation_1.validateReq)(add_comment_1.AddMediaCommentSchema), media_comment_controller_1.addMediaComment);
/**
 * @swagger
 * /api/media-comment/{id}:
 *   get:
 *     tags: [Media Comments]
 *     summary: Get a media comment by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid convex id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetMediaCommentByIdSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/:id', media_comment_controller_1.getMediaCommentById);
/**
 * @swagger
 * /api/media-comment:
 *   get:
 *     tags: [Media Comments]
 *     summary: Get all media comments
 *     parameters:
 *       - name: limit
 *         in: query
 *         default: 20
 *         required: false
 *         schema:
 *           type: integer
 *       - name: cursor
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: cursor for pagination
 *       - name: entityId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: entityType
 *         in: query
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/HistoryEntityType'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetMediaCommentsSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/', media_comment_controller_1.getMediaComments);
/**
 * @swagger
 * /api/media-comment/{id}:
 *   delete:
 *     tags: [Media Comments]
 *     summary: Delete media comment by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid convex id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteMediaCommentSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/:id', (0, require_auth_1.requireAuth)(), media_comment_controller_1.deleteMediaCommentById);
/**
 * @swagger
 * /api/media-comment/{id}:
 *   put:
 *     tags: [Media Comments]
 *     summary: Update media comment by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid convex id
 *         schema:
 *           type: string
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateMediaCommentRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateMediaCommentSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.put('/:id', (0, require_auth_1.requireAuth)(), (0, handle_validation_1.validateReq)(update_comment_1.UpdateMediaCommentSchema), media_comment_controller_1.updateMediaCommentById);
//export all the routes
exports.default = route;
