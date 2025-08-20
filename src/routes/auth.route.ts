/**
 * @file contains all the routes related to authentication
 */

import { Router } from 'express';
import { validateReq } from '../common/middleware/handle-validation';
import { LoginZodSchema } from '../common/validation-schema/auth/login-user';
import { login, verifyToken } from '../controllers/auth.controller';

// initialize router
const route = Router();

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
route.post('/login', validateReq(LoginZodSchema), login);

//route to verify the token
route.get('/verify', verifyToken);

//export all the routes
export default route;
