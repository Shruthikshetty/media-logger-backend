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
  updateUser,
} from '../controllers/user.controller';
import { AddUserZodSchema } from '../common/validation-schema/user/add-user';
import { validateReq } from '../common/middleware/handle-validation';
import { requireAuth } from '../common/middleware/require-auth';
import { UpdateUserZodSchema } from '../common/validation-schema/user/update-user';

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

//update user
route.patch('/', requireAuth(), validateReq(UpdateUserZodSchema), updateUser);

// export all routers clubbed
export default route;
