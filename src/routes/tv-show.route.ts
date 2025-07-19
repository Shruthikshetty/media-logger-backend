/**
 * @file contains all the routes related to tv show
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddTvShowZodSchema } from '../common/validation-schema/tv-show/add-tv-show';
import { addTvShow } from '../controllers/tv-show.controller';
import { addSeason } from '../controllers/tv-season.controller';
import { AddSeasonZodSchema } from '../common/validation-schema/tv-show/add-season';
import { addEpisode } from '../controllers/tv-episode.controller';
import { AddEpisodeZodSchema } from '../common/validation-schema/tv-show/add-episode';

//initialize router
const route = Router();

/**
 * @swagger
 * /tv-shows:
 *   post:
 *     summary: Add a new TV Show
 *     tags: [TV Shows]
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddTvShowBody'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/TvShowResponse'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
route.post(
  '/',
  requireAuth('admin'),
  validateReq(AddTvShowZodSchema),
  addTvShow
);

//Route to add a season to a tv-show
route.post(
  '/season',
  requireAuth('admin'),
  validateReq(AddSeasonZodSchema),
  addSeason
);

//Route to add a Episode to a season
route.post(
  '/episode',
  requireAuth('admin'),
  validateReq(AddEpisodeZodSchema),
  addEpisode
);

//export all the routes
export default route;
