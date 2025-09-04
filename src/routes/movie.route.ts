/**
 * @file contains the movie related routes
 */

import { Router } from 'express';
import {
  addMovie,
  deleteMovieById,
  getAllMovies,
  getMovieById,
  updateMovieById,
  bulkDeleteMovies,
  addBulkMovies,
  searchMovies,
  getMoviesWithFilters,
} from '../controllers/movie.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMovieZodSchema } from '../common/validation-schema/movie/add-movie';
import { updateMoveZodSchema } from '../common/validation-schema/movie/update-movie';
import { BulkDeleteMovieZodSchema } from '../common/validation-schema/movie/bulk-delete';
import jsonUpload from '../common/config/json-upload.config';
import { ValidateJsonFile } from '../common/middleware/handle-json-file-validation';
import { BulkAddMovieZodSchema } from '../common/validation-schema/movie/bulk-add';
import { handleUpload } from '../common/middleware/handle-upload';
import { MovieFiltersZodSchema } from '../common/validation-schema/movie/movie-filters';

// initialize router
const route = Router();

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
route.get('/', getAllMovies);

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
route.get('/search', searchMovies);

/**
 * @swagger
 * /api/movie/filter:
 *   post:
 *     summary: Get movies by filters with title search  (supports page based pagination only )
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
route.post('/filter', validateReq(MovieFiltersZodSchema), getMoviesWithFilters);

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
route.get('/:id', getMovieById);

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
route.post('/', requireAuth('admin'), validateReq(AddMovieZodSchema), addMovie);

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
route.post(
  '/bulk',
  requireAuth('admin'),
  handleUpload(jsonUpload, 'movieDataFile'),
  ValidateJsonFile(BulkAddMovieZodSchema),
  addBulkMovies
);

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
route.delete(
  '/bulk',
  requireAuth('admin'),
  validateReq(BulkDeleteMovieZodSchema),
  bulkDeleteMovies
);

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
route.delete('/:id', requireAuth('admin'), deleteMovieById);

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
route.patch(
  '/:id',
  requireAuth('admin'),
  validateReq(updateMoveZodSchema),
  updateMovieById
);

// export all the routes
export default route;
