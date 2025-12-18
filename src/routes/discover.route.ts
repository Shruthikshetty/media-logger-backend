/**
 * @file contains all the routes related to discovery of media specific to user
 */

import { Router } from 'express';
import {
  getDiscoverGames,
  getDiscoverMovies,
  getDiscoverTVSeries,
} from '../controllers/discover.controller';
import { optionalAuth } from '../common/middleware/require-auth';

//initialize router
const route = Router();

/**
 * @swagger
 * /api/discover/games:
 *   get:
 *     tags: [Discovery]
 *     summary: Fetch games with populated user states .
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         require: false
 *         type: integer
 *         default: 20
 *       - name: page
 *         in: query
 *         require: false
 *         type: integer
 *         default: 20
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDiscoverGamesSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/games', optionalAuth(), getDiscoverGames);

/**
 * @swagger
 * /api/discover/movies:
 *   get:
 *     tags: [Discovery]
 *     summary: Fetch movies with populated user states .
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         require: false
 *         type: integer
 *         default: 20
 *       - name: page
 *         in: query
 *         require: false
 *         type: integer
 *         default: 20
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDiscoverMoviesSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/movies', optionalAuth(), getDiscoverMovies);

/**
 * @swagger
 * /api/discover/tv-show:
 *   get:
 *     tags: [Discovery]
 *     summary: Fetch tv shows with populated user states .
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         require: false
 *         type: integer
 *         default: 20
 *       - name: page
 *         in: query
 *         require: false
 *         type: integer
 *         default: 20
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDiscoverTvShowSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/tv-show', optionalAuth(), getDiscoverTVSeries);

//export all routes
export default route;
