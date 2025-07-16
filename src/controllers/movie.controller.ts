/**
 * @file contains the movie controllers
 */
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { handleError } from '../common/utils/handle-error';
import { AddMovieZodSchemaType } from '../common/validation-schema/movie/add-movie';
import Movie from '../models/movie.model';
import { isDuplicateKeyError } from '../common/utils/mongo-errors';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import { GET_ALL_MOVIES_LIMITS } from '../common/constants/config.constants';

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
      message: isDuplicateKeyError(err)
        ? 'Movie already exists'
        : 'Server down please try again later',
    });
  }
};

/**
 * controller to fetch all the movies with pagination
 */
export const getAllMovies = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  // get pagination params
  const { limit, start } = getPaginationParams(
    req.query,
    GET_ALL_MOVIES_LIMITS
  );

  try {
    //try to fetch all movies
    const [movies, total] = await Promise.all([
      Movie.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(start)
        .lean()
        .exec(),
      Movie.countDocuments(),
    ]);

    // get pagination details
    const pagination = getPaginationResponse(total, limit, start);

    // return movies
    res.status(200).json({
      success: true,
      data: {
        movies,
        pagination,
      },
    });
  } catch (err) {
    // handle unexpected errors
    handleError(res, {
      error: err,
    });
  }
};

/**
 * delete movie by id
 */
export const deleteMovieById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;

    // delete the movie
    const deletedMovie = await Movie.findByIdAndDelete(id).lean().exec();

    // in case movie is not deleted
    if (!deletedMovie) {
      handleError(res, { message: 'movie dose not exist' });
      return;
    }

    // return the deleted movie
    res.status(200).json({
      success: true,
      data: deletedMovie,
      message: 'Movie deleted successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};
