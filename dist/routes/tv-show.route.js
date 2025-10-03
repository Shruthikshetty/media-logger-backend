"use strict";
/**
 * @file contains all the routes related to tv show
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const require_auth_1 = require("../common/middleware/require-auth");
const handle_validation_1 = require("../common/middleware/handle-validation");
const add_tv_show_1 = require("../common/validation-schema/tv-show/add-tv-show");
const tv_show_controller_1 = require("../controllers/tv-show.controller");
const tv_season_controller_1 = require("../controllers/tv-season.controller");
const add_season_1 = require("../common/validation-schema/tv-show/add-season");
const tv_episode_controller_1 = require("../controllers/tv-episode.controller");
const add_episode_1 = require("../common/validation-schema/tv-show/add-episode");
const update_episode_1 = require("../common/validation-schema/tv-show/update-episode");
const update_season_1 = require("../common/validation-schema/tv-show/update-season");
const update_tv_show_1 = require("../common/validation-schema/tv-show/update-tv-show");
const bulk_delete_tv_show_1 = require("../common/validation-schema/tv-show/bulk-delete-tv-show");
const tv_show_filter_1 = require("../common/validation-schema/tv-show/tv-show-filter");
const bulk_add_tv_show_1 = require("../common/validation-schema/tv-show/bulk-add-tv-show");
const handle_json_file_validation_1 = require("../common/middleware/handle-json-file-validation");
const handle_upload_1 = require("../common/middleware/handle-upload");
const json_upload_config_1 = __importDefault(require("../common/config/json-upload.config"));
//initialize router
const route = (0, express_1.Router)();
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
route.post('/', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(add_tv_show_1.AddTvShowZodSchema), tv_show_controller_1.addTvShow);
/**
 * @swagger
 * /api/tv-show/bulk:
 *   post:
 *     summary: Bulk add tv shows
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tvShowDataFile:
 *                 type: string
 *                 format: binary
 *                 description: JSON file containing an array of tv shows
 *           encoding:
 *             tvShowDataFile:
 *               contentType: application/json
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/BulkAddTvShowSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_upload_1.handleUpload)(json_upload_config_1.default, 'tvShowDataFile'), (0, handle_json_file_validation_1.ValidateJsonFile)(bulk_add_tv_show_1.BulkAddTvShowZodSchema), tv_show_controller_1.bulkAddTvShow);
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
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/', tv_show_controller_1.getAllTvShows);
/**
 * @swagger
 * /api/tv-show/search:
 *   get:
 *     summary: Search for TV Shows
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
 *       - name: text
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetTvShowsBySearchSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/search', tv_show_controller_1.searchTvShow);
/**
 * @swagger
 * /api/tv-show/filter:
 *   post:
 *     summary: Filter TV Shows
 *     tags: [TV Shows]
 *     requestBody:
 *       $ref: '#/components/requestBodies/FilterTvShowBody'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetTvShowsBySearchSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/filter', (0, handle_validation_1.validateReq)(tv_show_filter_1.FilterTvShowZodSchema), tv_show_controller_1.filterTvShow);
/**
 * @swagger
 * /api/tv-show/{id}:
 *   get:
 *     summary: Get tv show by id
 *     tags: [TV Shows]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: valid mongo id
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetTvShowSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 */
route.get('/:id', tv_show_controller_1.getTvShowById);
/**
 * @swagger
 * /api/tv-show/{id}:
 *   patch:
 *     summary: Update a tv show
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
 *       $ref: '#/components/requestBodies/UpdateTvShowRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/TvShowResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
route.patch('/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_tv_show_1.UpdateTvShowZodSchema), tv_show_controller_1.updateTvShowById);
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
route.post('/season', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(add_season_1.AddSeasonZodSchema), tv_season_controller_1.addSeason);
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
route.post('/episode', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(add_episode_1.AddEpisodeZodSchema), tv_episode_controller_1.addEpisode);
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
route.get('/episode/:id', tv_episode_controller_1.getEpisodeById);
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
route.delete('/episode/:id', (0, require_auth_1.requireAuth)('admin'), tv_episode_controller_1.deleteEpisodeById);
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
route.patch('/episode/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_episode_1.UpdateEpisodeZodSchema), tv_episode_controller_1.updateEpisodeById);
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
route.get('/season/:id', tv_season_controller_1.getSeasonById);
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
route.patch('/season/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_season_1.UpdateSeasonZodSchema), tv_season_controller_1.updateSeason);
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
route.delete('/season/:id', (0, require_auth_1.requireAuth)('admin'), tv_season_controller_1.deleteSeasonById);
/**
 * @swagger
 * /api/tv-show/bulk:
 *   delete:
 *     summary: Delete multiple tv shows by ID
 *     tags: [TV Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/BulkDeleteTvShowRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/BulkDeleteTvShowSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(bulk_delete_tv_show_1.BulkDeleteTvShowZodSchema), tv_show_controller_1.bulkDeleteTvShow);
/**
 * @swagger
 * /api/tv-show/{id}:
 *   delete:
 *     summary: Delete a tv show by ID
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
 *         $ref: '#/components/responses/DeleteTvShowSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/:id', (0, require_auth_1.requireAuth)('admin'), tv_show_controller_1.deleteTvShowById);
//export all the routes
exports.default = route;
