/**
 * @file contains all the routes related to a user
 */
import { Router } from 'express';
import {
  addUser,
  getAllUsers,
  getUserDetail,
  deleteUser,
  deleteUserById,
  updateUser,
  updateRoleById,
  filterUsers,
} from '../controllers/user.controller';
import { AddUserZodSchema } from '../common/validation-schema/user/add-user';
import { validateReq } from '../common/middleware/handle-validation';
import { requireAuth } from '../common/middleware/require-auth';
import { UpdateUserZodSchema } from '../common/validation-schema/user/update-user';
import { UpdateRoleZodSchema } from '../common/validation-schema/user/update-role';
import { FilterUserZodSchema } from '../common/validation-schema/user/filter-user';

// initialize router
const route = Router();

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
route.post('/', validateReq(AddUserZodSchema), addUser);

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
route.get('/', requireAuth(), getUserDetail);

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
route.post(
  '/filter',
  requireAuth('admin'),
  validateReq(FilterUserZodSchema),
  filterUsers
);

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
route.get('/all', requireAuth('admin'), getAllUsers);

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
route.delete('/', requireAuth(), deleteUser);

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
route.delete('/:id', requireAuth('admin'), deleteUserById);

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
route.patch('/', requireAuth(), validateReq(UpdateUserZodSchema), updateUser);

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
route.put(
  '/role/:id',
  requireAuth('admin'),
  validateReq(UpdateRoleZodSchema),
  updateRoleById
);

// export all routers clubbed
export default route;
