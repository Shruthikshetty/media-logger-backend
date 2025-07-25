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

// get all movies
route.get('/', getAllMovies);

//search a movie by title
route.get('/search', searchMovies);

//get movies with filters
route.get('/filter', validateReq(MovieFiltersZodSchema), getMoviesWithFilters);

//get movie by id
route.get('/:id', getMovieById);

// add a movie
route.post('/', requireAuth('admin'), validateReq(AddMovieZodSchema), addMovie);

// add bulk movies in json file
route.post(
  '/bulk',
  requireAuth('admin'),
  handleUpload(jsonUpload, 'movieDataFile'),
  ValidateJsonFile(BulkAddMovieZodSchema),
  addBulkMovies
);

//Route to bulk delete movies
route.delete(
  '/bulk',
  requireAuth('admin'),
  validateReq(BulkDeleteMovieZodSchema),
  bulkDeleteMovies
);

// delete movie by id
route.delete('/:id', requireAuth('admin'), deleteMovieById);

// update a movie by id
route.patch(
  '/:id',
  requireAuth('admin'),
  validateReq(updateMoveZodSchema),
  updateMovieById
);

// export all the routes
export default route;
