/**
 * @file contains all the recommendation related services
 */

import { Router } from 'express';
import { getHealth } from '../controllers/recommend.route';

// initialize router
const route = Router();

//health check route
route.get('/health', getHealth);

//export all the routes
export default route;
