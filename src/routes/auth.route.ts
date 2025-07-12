/**
 * @file contains all the routes related to authentication
 */

import { Router } from 'express';
import { validateReq } from '../common/middleware/handle-validation';
import { LoginZodSchema } from '../common/validation-schema/auth/login-user';
import { login } from '../controllers/auth.controller';

// initialize router
const route = Router();

// login
route.post('/login', validateReq(LoginZodSchema), login);

//export all the routes
export default route;
