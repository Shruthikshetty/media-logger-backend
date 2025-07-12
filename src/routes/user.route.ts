/**
 * @file contains all the routes related to a user
 */
//@TODO in progress
import { Router } from 'express';
import { addUser } from '../controllers/user.controller';
import { AddUserZodSchema } from '../common/validation-schema/user/add-user';
import { validateReq } from '../common/middleware/handle-validation';

// initialize router
const route = Router();

//Route to create a user (register)
route.post('/', validateReq(AddUserZodSchema), addUser);

// export all routers clubbed
export default route;
