"use strict";
/**
 * @file contains all the routes related to authentication
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handle_validation_1 = require("../common/middleware/handle-validation");
const login_user_1 = require("../common/validation-schema/auth/login-user");
const auth_controller_1 = require("../controllers/auth.controller");
// initialize router
const route = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/LoginRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/LoginSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/LoginUnauthorizedResponse'
 *       '404':
 *         $ref: '#/components/responses/LoginNotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/login', (0, handle_validation_1.validateReq)(login_user_1.LoginZodSchema), auth_controller_1.login);
//route to verify the token
route.get('/verify', auth_controller_1.verifyToken);
//export all the routes
exports.default = route;
