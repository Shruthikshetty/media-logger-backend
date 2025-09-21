"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file contains all the routes related to a user
 */
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const add_user_1 = require("../common/validation-schema/user/add-user");
const handle_validation_1 = require("../common/middleware/handle-validation");
const require_auth_1 = require("../common/middleware/require-auth");
const update_user_1 = require("../common/validation-schema/user/update-user");
const update_role_1 = require("../common/validation-schema/user/update-role");
const filter_user_1 = require("../common/validation-schema/user/filter-user");
// initialize router
const route = (0, express_1.Router)();
/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddUserRequest'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/AddUserSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/', (0, handle_validation_1.validateReq)(add_user_1.AddUserZodSchema), user_controller_1.addUser);
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get logged in user detail
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetUserDetailSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
route.get('/', (0, require_auth_1.requireAuth)(), user_controller_1.getUserDetail);
/**
 * @swagger
 * /api/user/filter:
 *   post:
 *     summary: Filter users and search by name
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/FilterUserRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllUsersSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/filter', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(filter_user_1.FilterUserZodSchema), user_controller_1.filterUsers);
/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllUsersSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/all', (0, require_auth_1.requireAuth)('admin'), user_controller_1.getAllUsers);
/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Delete logged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteUserSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/', (0, require_auth_1.requireAuth)(), user_controller_1.deleteUser);
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by id requires admin access
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteUserSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/:id', (0, require_auth_1.requireAuth)('admin'), user_controller_1.deleteUserById);
/**
 * @swagger
 * /api/user:
 *   patch:
 *     summary: Update logged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateUserRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateUserSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.patch('/', (0, require_auth_1.requireAuth)(), (0, handle_validation_1.validateReq)(update_user_1.UpdateUserZodSchema), user_controller_1.updateUser);
/**
 * @swagger
 * /api/user/role/{id}:
 *   put:
 *     summary: Update user role by id requires admin access
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateRoleRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateUserSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.put('/role/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_role_1.UpdateRoleZodSchema), user_controller_1.updateRoleById);
// export all routers clubbed
exports.default = route;
