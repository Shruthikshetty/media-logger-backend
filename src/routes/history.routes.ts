/**
 * This @file contains the routes for history
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import {
  getAllHistory,
  getHistoryByFilters,
} from '../controllers/history.controller';
import { validateReq } from '../common/middleware/handle-validation';
import { HistoryFilterZodSchema } from '../common/validation-schema/history/history-filter';

//initialize router
const route = Router();

// route to get all history with pagination
route.get('/', requireAuth('admin'), getAllHistory);

//route to get history by filters
route.post(
  '/filter',
  requireAuth('admin'),
  validateReq(HistoryFilterZodSchema),
  getHistoryByFilters
);

//export all the routes
export default route;
