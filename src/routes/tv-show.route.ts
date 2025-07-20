/**
 * @file contains all the routes related to tv show
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddTvShowZodSchema } from '../common/validation-schema/tv-show/add-tv-show';
import { addTvShow, getAllTvShows } from '../controllers/tv-show.controller';
import {
  addSeason,
  getSeasonById,
  updateSeason,
  deleteSeasonById,
} from '../controllers/tv-season.controller';
import { AddSeasonZodSchema } from '../common/validation-schema/tv-show/add-season';
import {
  addEpisode,
  deleteEpisodeById,
  getEpisodeById,
  updateEpisodeById,
} from '../controllers/tv-episode.controller';
import { AddEpisodeZodSchema } from '../common/validation-schema/tv-show/add-episode';
import { UpdateEpisodeZodSchema } from '../common/validation-schema/tv-show/update-episode';
import { UpdateSeasonZodSchema } from '../common/validation-schema/tv-show/update-season';

//initialize router
const route = Router();

/**
 * @swagger
 * /api/tv-show:
 *   post:
 *     summary: Add a new TV Show
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddTvShowBody'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/TvShowResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post(
  '/',
  requireAuth('admin'),
  validateReq(AddTvShowZodSchema),
  addTvShow
);

//get all the tv shows
route.get('/', getAllTvShows);

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

//Route to get a episode by id
route.get('/episode/:id', getEpisodeById);

//Route to delete episode by id
route.delete('/episode/:id', requireAuth('admin'), deleteEpisodeById);

//Route to update a episode by id
route.patch(
  '/episode/:id',
  requireAuth('admin'),
  validateReq(UpdateEpisodeZodSchema),
  updateEpisodeById
);

//Route to get season  by id
route.get('/season/:id', getSeasonById);

//Route to update a season by id
route.patch(
  '/season/:id',
  requireAuth('admin'),
  validateReq(UpdateSeasonZodSchema),
  updateSeason
);

//Route to delete season by id (this will delete all the episodes as well)
route.delete('/season/:id', requireAuth('admin'), deleteSeasonById);

//export all the routes
export default route;
