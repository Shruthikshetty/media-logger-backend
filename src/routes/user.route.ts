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
} from '../controllers/user.controller';
import { AddUserZodSchema } from '../common/validation-schema/user/add-user';
import { validateReq } from '../common/middleware/handle-validation';
import { requireAuth } from '../common/middleware/require-auth';
import { UpdateUserZodSchema } from '../common/validation-schema/user/update-user';
import { UpdateRoleZodSchema } from '../common/validation-schema/user/update-role';

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
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/', validateReq(AddUserZodSchema), addUser);

//Route to get all users
route.get('/all', requireAuth('admin'), getAllUsers);

//Route to get a user detail
route.get('/', requireAuth(), getUserDetail);

// delete user by id
route.delete('/', requireAuth(), deleteUser);

//delete user by id
route.delete('/:id', requireAuth('admin'), deleteUserById);

//update user
route.patch('/', requireAuth(), validateReq(UpdateUserZodSchema), updateUser);

//update role by id
route.put(
  '/role/:id',
  requireAuth('admin'),
  validateReq(UpdateRoleZodSchema),
  updateRoleById
);

// export all routers clubbed
export default route;
