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
  addBulkMovies
} from '../controllers/movie.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMovieZodSchema } from '../common/validation-schema/movie/add-movie';
import { updateMoveZodSchema } from '../common/validation-schema/movie/update-movie';
import { BulkDeleteMovieZodSchema } from '../common/validation-schema/movie/bulk-delete';
import jsonUpload from '../common/config/json-upload.config';
import { ValidateJsonFile } from '../common/middleware/handle-json-file-validation';
import { BulkAddMovieZodSchema } from '../common/validation-schema/movie/bulk-add';

// initialize router
const route = Router();

// get all movies
route.get('/', getAllMovies);

//get movie by id
route.get('/:id', getMovieById);

// add a movie
route.post('/', requireAuth('admin'), validateReq(AddMovieZodSchema), addMovie);

// add bulk movies in json file 
route.post(
  '/bulk',
  requireAuth('admin'),
  jsonUpload.single('movieDataFile'),
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
