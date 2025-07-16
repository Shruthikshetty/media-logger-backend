/**
 * @file contains the movie controllers
 */
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { handleError } from '../common/utils/handle-error';
import { AddMovieZodSchemaType } from '../common/validation-schema/movie/add-movie';
import Movie from '../models/movie.model';

// controller to add a new movie
export const addMovie = async (
  req: ValidatedRequest<AddMovieZodSchemaType>,
  res: Response
) => {
  try {
    // create a new movie
    const newMovie = new Movie(req.validatedData!);

    // save the movie
    const savedMovie = await newMovie.save();

    if (!savedMovie) {
      handleError(res, { message: 'Movie creation failed' });
      return;
    }

    res.status(200).json({
      success: true,
      data: savedMovie,
      message: 'Movie created successfully',
    });
  } catch (err) {
    // handle unexpected errors
    handleError(res, {
      error: err,
    });
  }
};

/**
 * controller to fetch all the movies
 */
export const getAllMovies = async (
  _req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    //try to fetch all movies
    const movies = await Movie.find().lean().exec();

    // return movies
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (err) {
    // handle unexpected errors
    handleError(res, {
      error: err,
    });
  }
};
