/**
 * @file contains all the routes related to analytics / aggregation of data
 */

import { Router } from 'express';
import { dashboardAdminAnalytics } from '../controllers/analytic.controller';
import { requireAuth } from '../common/middleware/require-auth';

// initialize router
const route = Router();

/**
 * @swagger
 * /api/analytic/dashboard-admin:
 *   get:
 *     summary: Get aggregated analytics data for admin dashboard
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDashboardAdminAnalyticsSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/dashboard-admin', requireAuth('admin'), dashboardAdminAnalytics);

//export all the routes
export default route;
