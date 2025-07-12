/**
 * This will combine all the routes to be imported in the index
 */

import { Router } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';

// initialize router
const route = Router();

//User routes
route.use('/user', userRoutes);

//Auth routes
route.use('/auth', authRoutes);

// export all the routes
export default route;
