/**
 * This @file contains the routes for history
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import { getAllHistory } from '../controllers/history.controller';

//initialize router
const route = Router();

// route to get all history with pagination
route.get('/', requireAuth('admin'), getAllHistory);
//export all the routes
export default route;
