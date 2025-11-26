/**
 * @file contains all the recommendation related services
 */

import { Router } from 'express';
import {
  getHealth,
  getSimilarGames,
  getSimilarMovies,
  getSimilarTvShow,
} from '../controllers/recommend.controller';

// initialize router
const route = Router();

/**
 * @swagger
 * /api/recommend/health:
 *   get:
 *     tags: [Recommendation]
 *     summary: Check the health of the recommendation service
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetHealthSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *       '504':
 *         $ref: '#/components/responses/TimeOut'
 */
route.get('/health', getHealth);

//get similar games (10 is predefined currently)
route.get('/similar-games/:id', getSimilarGames);

//get similar movies (10 is predefined currently)
route.get('/similar-movies/:id', getSimilarMovies);

//get similar tv shows (10 is predefined currently)
route.get('/similar-shows/:id', getSimilarTvShow);

//export all the routes
export default route;
