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
/**
 * @swagger
 * /api/tv-show:
 *   get:
 *     summary: Get all TV Shows
 *     tags: [TV Shows]
 *     parameters:
 *       - name: limit
 *         in: query
 *         default: 20
 *         required: false
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         default: 1
 *         required: false
 *         schema:
 *           type: integer
 *       - name: start
 *         in: query
 *         default: 0
 *         required: false
 *         schema:
 *           type: integer
 *       - name: fullDetails
 *         in: query
 *         required: false
 *         default: false
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllTvShowsSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /api/tv-show/season:
 *   post:
 *     summary: Add a season to a tv show
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddSeasonRequest'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/AddSeasonSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /api/tv-show/episode/{id}:
 *   get:
 *     summary: Get an episode by ID
 *     tags: [TV Shows]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *       - name: fullDetails
 *         in: query
 *         required: false
 *         default: false
 *         description: full details with seasons and TV information
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetEpisodeSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/episode/:id', getEpisodeById);

/**
 * @swagger
 * /api/tv-show/episode/{id}:
 *   delete:
 *     summary: Delete an episode by ID
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteEpisodeSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/episode/:id', requireAuth('admin'), deleteEpisodeById);

/**
 * @swagger
 * /api/tv-show/episode/{id}:
 *   patch:
 *     summary: Update an episode by ID
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateEpisodeRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateEpisodeSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.patch(
  '/episode/:id',
  requireAuth('admin'),
  validateReq(UpdateEpisodeZodSchema),
  updateEpisodeById
);

/**
 * @swagger
 * /api/tv-show/season/{id}:
 *   get:
 *     summary: Get a season by ID
 *     tags: [TV Shows]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *       - name: fullDetails
 *         in: query
 *         required: false
 *         default: false
 *         description: full details with episodes
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetSeasonSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/season/:id', getSeasonById);

/**
 * @swagger
 * /api/tv-show/season/{id}:
 *   patch:
 *     summary: Update a season by ID
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateSeasonRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateSeasonSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.patch(
  '/season/:id',
  requireAuth('admin'),
  validateReq(UpdateSeasonZodSchema),
  updateSeason
);

/**
 * @swagger
 * /api/tv-show/season/{id}:
 *   delete:
 *     summary: Delete a season by ID (this will also delete all episodes in the season)
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: valid mongo id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteSeasonSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
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
