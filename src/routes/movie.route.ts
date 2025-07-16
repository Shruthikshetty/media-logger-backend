/**
 * @file contains the movie related routes
 */

import { Router } from 'express';
import { addMovie, deleteMovieById, getAllMovies } from '../controllers/movie.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMovieZodSchema } from '../common/validation-schema/movie/add-movie';

// initialize router
const route = Router();

// get all movies
route.get('/', getAllMovies);

// add a movie
route.post('/', requireAuth('admin'), validateReq(AddMovieZodSchema), addMovie);

// delete movie by id
route.delete('/:id', requireAuth('admin'), deleteMovieById);

// export all the routes
export default route;
