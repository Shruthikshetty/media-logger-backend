/**
 * This will combine all the routes to be imported in the index
 */

import { Router } from 'express';
import userRoutes from './user.route';

// initialize router
const route = Router();

//User routes
route.use('/user', userRoutes);

// export all the routes
export default route;
