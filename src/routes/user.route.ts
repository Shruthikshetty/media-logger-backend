/**
 * @file contains all the routes related to a user
 */
//@TODO in progress
import { Router } from 'express';
import { addUser } from '../controllers/user.controller';
import { checkSchema } from 'express-validator';
import { AddUserValidationSchema } from '../common/validation-schema/user/add-user';
import { validate } from '../common/utils/handle-validation';

// initialize router
const route = Router();

//Route to create a user
route.post('/', checkSchema(AddUserValidationSchema), validate, addUser);

// export all routers clubbed
export default route;
