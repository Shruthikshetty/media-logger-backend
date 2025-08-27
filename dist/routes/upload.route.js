"use strict";
/**
 * @file contains all the routes related to upload
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const require_auth_1 = require("../common/middleware/require-auth");
const image_upload_config_1 = __importDefault(require("../common/config/image-upload.config"));
const handle_upload_1 = require("../common/middleware/handle-upload");
const upload_controller_1 = require("../controllers/upload.controller");
//initialize router
const route = (0, express_1.Router)();
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
route.post('/image', (0, require_auth_1.requireAuth)('admin'), (0, handle_upload_1.handleUpload)(image_upload_config_1.default, 'image'), upload_controller_1.uploadImage);
// export all the routes aggregated
exports.default = route;
