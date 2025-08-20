"use strict";
/**
 * @file contains the movie related routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controllers/movie.controller");
const require_auth_1 = require("../common/middleware/require-auth");
const handle_validation_1 = require("../common/middleware/handle-validation");
const add_movie_1 = require("../common/validation-schema/movie/add-movie");
const update_movie_1 = require("../common/validation-schema/movie/update-movie");
const bulk_delete_1 = require("../common/validation-schema/movie/bulk-delete");
const json_upload_config_1 = __importDefault(require("../common/config/json-upload.config"));
const handle_json_file_validation_1 = require("../common/middleware/handle-json-file-validation");
const bulk_add_1 = require("../common/validation-schema/movie/bulk-add");
const handle_upload_1 = require("../common/middleware/handle-upload");
const movie_filters_1 = require("../common/validation-schema/movie/movie-filters");
// initialize router
const route = (0, express_1.Router)();
/**
 * @swagger
 * /api/movie:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     parameters:
 *       - name: limit
 *         in: query
 *         default: 20
 *         schema:
 *           type: integer
 *         required: false
 *       - name: page
 *         in: query
 *         default: 1
 *         schema:
 *           type: integer
 *         required: false
 *       - name: start
 *         default: 0
 *         in: query
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllMoviesSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/', movie_controller_1.getAllMovies);
/**
 * @swagger
 * /api/movie/search:
 *   get:
 *     summary: Search movies by title (this has infinite scroll based pagination only use start and limit)
 *     tags: [Movies]
 *     parameters:
 *       - name: text
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "Rush Hour"
 *       - name: limit
 *         in: query
 *         default: 20
 *         schema:
 *           type: integer
 *         required: false
 *       - name: start
 *         default: 0
 *         in: query
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetMoviesSearchSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/search', movie_controller_1.searchMovies);
/**
 * @swagger
 * /api/movie/filter:
 *   post:
 *     summary: Get movies by filters (supports page based pagination only )
 *     tags: [Movies]
 *     requestBody:
 *       $ref: '#/components/requestBodies/MoviesFilterRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllMoviesSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/filter', (0, handle_validation_1.validateReq)(movie_filters_1.MovieFiltersZodSchema), movie_controller_1.getMoviesWithFilters);
/**
 * @swagger
 * /api/movie/{id}:
 *   get:
 *     summary: Get movie by id
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required:
 *         schema:
 *           type: string
 *         description: valid mongo id
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetMovieSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 */
route.get('/:id', movie_controller_1.getMovieById);
/**
 * @swagger
 * /api/movie:
 *   post:
 *     summary: Add movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddMovieRequest'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/AddMovieSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(add_movie_1.AddMovieZodSchema), movie_controller_1.addMovie);
/**
 * @swagger
 * /api/movie/bulk:
 *   post:
 *     summary: Bulk add movies from uploaded JSON file
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - movieDataFile
 *             properties:
 *               movieDataFile:
 *                 type: string
 *                 format: binary
 *                 description: JSON file containing an array of movies
 *           encoding:
 *             movieDataFile:
 *               contentType: application/json
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/BulkAddMovieSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '207':
 *         $ref: '#/components/responses/BulkAddMovieSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_upload_1.handleUpload)(json_upload_config_1.default, 'movieDataFile'), (0, handle_json_file_validation_1.ValidateJsonFile)(bulk_add_1.BulkAddMovieZodSchema), movie_controller_1.addBulkMovies);
/**
 * @swagger
 * /api/movie/bulk:
 *   delete:
 *     summary: Bulk delete movies by ids
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/BulkDeleteMovieRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteBulkMovieSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(bulk_delete_1.BulkDeleteMovieZodSchema), movie_controller_1.bulkDeleteMovies);
/**
 * @swagger
 * /api/movie/{id}:
 *   delete:
 *     summary: Delete movie by id
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: valid mongo id
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteMovieSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/:id', (0, require_auth_1.requireAuth)('admin'), movie_controller_1.deleteMovieById);
/**
 * @swagger
 * /api/movie/{id}:
 *   patch:
 *     summary: Update movie by id requires admin access
 *     tags: [Movies]
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
 *       $ref: '#/components/requestBodies/UpdateMovieRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateMovieSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.patch('/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_movie_1.updateMoveZodSchema), movie_controller_1.updateMovieById);
// export all the routes
exports.default = route;
