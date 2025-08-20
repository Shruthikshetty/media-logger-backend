/**
 * @file contains all the routes related to analytics / aggregation of data
 */

import { Router } from 'express';
import { dashboardAdminAnalytics } from '../controllers/analytic.controller';
import { requireAuth } from '../common/middleware/require-auth';

// initialize router
const route = Router();

// get the aggregated analytics data for admin dashboard
route.get('/dashboard-admin', requireAuth('admin'), dashboardAdminAnalytics);

//export all the routes
export default route;
