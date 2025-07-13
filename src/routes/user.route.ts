/**
 * @file contains all the routes related to a user
 */
//@TODO in progress
import { Router } from 'express';
import {
  addUser,
  getAllUsers,
  getUserDetail,
  deleteUser,
  deleteUserById,
} from '../controllers/user.controller';
import { AddUserZodSchema } from '../common/validation-schema/user/add-user';
import { validateReq } from '../common/middleware/handle-validation';
import { requireAuth } from '../common/middleware/require-auth';

// initialize router
const route = Router();

//Route to create a user (register)
route.post('/', validateReq(AddUserZodSchema), addUser);

//Route to get all users
route.get('/all', requireAuth('admin'), getAllUsers);

//Route to get a user detail
route.get('/', requireAuth(), getUserDetail);

// delete user by id
route.delete('/', requireAuth(), deleteUser);

//delete user by id
route.delete('/:id', requireAuth('admin'), deleteUserById);

// export all routers clubbed
export default route;
