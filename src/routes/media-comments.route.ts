/**
 * This @file contains all the routes for media comments
 */

import { Router } from 'express';
import {
  addMediaComment,
  getMediaComments,
  getMediaCommentById,
  deleteMediaCommentById,
  updateMediaCommentById,
} from '../controllers/media-comment.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMediaCommentSchema } from '../common/validation-schema/media-comment/add-comment';
import { UpdateMediaCommentSchema } from '../common/validation-schema/media-comment/update-comment';

//initialize router
const route = Router();

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
route.post(
  '/',
  requireAuth(),
  validateReq(AddMediaCommentSchema),
  addMediaComment
);

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
route.get('/:id', getMediaCommentById);

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
route.get('/', getMediaComments);

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
route.delete('/:id', requireAuth(), deleteMediaCommentById);

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
route.put(
  '/:id',
  requireAuth(),
  validateReq(UpdateMediaCommentSchema),
  updateMediaCommentById
);

//export all the routes
export default route;
