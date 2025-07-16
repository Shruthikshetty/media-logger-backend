/**
 * @file contains the movie related routes
 */

import { Router } from 'express';
import {
  addMovie,
  deleteMovieById,
  getAllMovies,
  updateMovieById,
} from '../controllers/movie.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMovieZodSchema } from '../common/validation-schema/movie/add-movie';
import { updateMoveZodSchema } from '../common/validation-schema/movie/update-movie';

// initialize router
const route = Router();

// get all movies
route.get('/', getAllMovies);

// add a movie
route.post('/', requireAuth('admin'), validateReq(AddMovieZodSchema), addMovie);

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
