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

//controller to get movie by id
export const getMovieById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;

    // get the movie
    const movie = await Movie.findById(id).lean().exec();

    // in case movie is not found
    if (!movie) {
      handleError(res, { message: 'Movie not found', statusCode: 404 });
      return;
    }

    // return the movie
    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (err) {
    // handle unexpected errors
    handleError(res, {
      error: err,
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

//update  movie by id
export const updateMovieById = async (
  req: ValidatedRequest<AddMovieZodSchemaType>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;

    // update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.validatedData!, {
      new: true,
    })
      .lean()
      .exec();

    // in case movie is not updated
    if (!updatedMovie) {
      handleError(res, { message: 'movie dose not exist' });
      return;
    }

    // return the updated movie
    res.status(200).json({
      success: true,
      data: updatedMovie,
      message: 'Movie updated successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//@TODO controller to add bulk movies by json 
//@TODO controller to bulk delete movies by taking list of ids
//@TODO search functionality 
//@TODO get movies with filters