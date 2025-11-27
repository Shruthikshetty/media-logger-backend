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

/**
 * @swagger
 * /api/recommend/similar-games/{id}:
 *   get:
 *     tags: [Recommendation]
 *     summary: Get 10 similar games for a given game ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetSimilarGamesSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/similar-games/:id', getSimilarGames);

/**
 * @swagger
 * /api/recommend/similar-movies/{id}:
 *   get:
 *     tags: [Recommendation]
 *     summary: Get 10 similar movies for a given movie ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetSimilarMoviesSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/similar-movies/:id', getSimilarMovies);

/**
 * @swagger
 * /api/recommend/similar-shows/{id}:
 *   get:
 *     tags: [Recommendation]
 *     summary: Get 10 similar tv shows for a given tv show ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetSimilarTvShowSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/similar-shows/:id', getSimilarTvShow);

//export all the routes
export default route;
