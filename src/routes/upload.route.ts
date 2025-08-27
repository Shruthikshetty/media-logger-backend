/**
 * @file contains all the routes related to upload
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import imageUpload from '../common/config/image-upload.config';
import { handleUpload } from '../common/middleware/handle-upload';
import { uploadImage } from '../controllers/upload.controller';

//initialize router
const route = Router();

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, or WebP)
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UploadImageSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post(
  '/image',
  requireAuth('admin'),
  handleUpload(imageUpload, 'image'),
  uploadImage
);

// export all the routes aggregated
export default route;
