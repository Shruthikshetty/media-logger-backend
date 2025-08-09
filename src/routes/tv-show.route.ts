/**
 * @file contains all the routes related to tv show
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddTvShowZodSchema } from '../common/validation-schema/tv-show/add-tv-show';
import {
  addTvShow,
  getAllTvShows,
  getTvShowById,
  updateTvShowById,
  bulkDeleteTvShow,
  deleteTvShowById,
  filterTvShow,
  bulkAddTvShow,
  searchTvShow,
} from '../controllers/tv-show.controller';
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
import { UpdateTvShowZodSchema } from '../common/validation-schema/tv-show/update-tv-show';
import { BulkDeleteTvShowZodSchema } from '../common/validation-schema/tv-show/bulk-delete-tv-show';
import { FilterTvShowZodSchema } from '../common/validation-schema/tv-show/tv-show-filter';
import { BulkAddTvShowZodSchema } from '../common/validation-schema/tv-show/bulk-add-tv-show';
import { ValidateJsonFile } from '../common/middleware/handle-json-file-validation';
import { handleUpload } from '../common/middleware/handle-upload';
import jsonUpload from '../common/config/json-upload.config';

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

// route to bulk add tv shows
route.post(
  '/bulk',
  requireAuth('admin'),
  handleUpload(jsonUpload, 'tvShowDataFile'),
  ValidateJsonFile(BulkAddTvShowZodSchema),
  bulkAddTvShow
);
//get all the tv shows
route.get('/', getAllTvShows);

//get tv show by search text
route.get('/search', searchTvShow);

//get tv show by filters
route.post('/filter', validateReq(FilterTvShowZodSchema), filterTvShow);

//Route to get tv show by id
route.get('/:id', getTvShowById);

//Route to update a tv show by id
route.patch(
  '/:id',
  requireAuth('admin'),
  validateReq(UpdateTvShowZodSchema),
  updateTvShowById
);

//Route to add a season to a tv-show
route.post(
  '/season',
  requireAuth('admin'),
  validateReq(AddSeasonZodSchema),
  addSeason
);

/**
 * @swagger
 * /api/tv-show/episode:
 *   post:
 *     summary: Add an episode to a season
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddEpisodeRequest'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/AddEpisodeSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
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

//Route to bulk delete tv shows
route.delete(
  '/bulk',
  requireAuth('admin'),
  validateReq(BulkDeleteTvShowZodSchema),
  bulkDeleteTvShow
);

// Route to delete a tv show by id
route.delete('/:id', requireAuth('admin'), deleteTvShowById);

//export all the routes
export default route;
