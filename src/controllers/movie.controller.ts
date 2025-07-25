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
import {
  GET_ALL_MOVIES_LIMITS,
  MOVIE_SEARCH_INDEX,
} from '../common/constants/config.constants';
import { BulkDeleteMovieZodSchemaType } from '../common/validation-schema/movie/bulk-delete';
import { BulkAddMovieZodSchemaType } from '../common/validation-schema/movie/bulk-add';
import { MovieFiltersZodType } from '../common/validation-schema/movie/movie-filters';

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

//controller to bulk delete movies by taking list of ids
export const bulkDeleteMovies = async (
  req: ValidatedRequest<BulkDeleteMovieZodSchemaType>,
  res: Response
) => {
  try {
    //delete all the movies that are passed
    const deletedMovies = await Movie.deleteMany({
      _id: {
        $in: req.validatedData!.movieIds,
      },
    });

    // return the deleted movies
    res.status(200).json({
      success: true,
      data: {
        deletedCount: deletedMovies.deletedCount,
      },
      message: 'Movies deleted successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller to add bulk movies by json
export const addBulkMovies = async (
  req: ValidatedRequest<BulkAddMovieZodSchemaType>,
  res: Response
) => {
  try {
    // bulk add all the movies
    const savedMovies = await Movie.insertMany(req.validatedData!);

    // return the saved movies
    res.status(200).json({
      success: true,
      data: savedMovies,
      message: 'Movies added successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
      message: isDuplicateKeyError(err)
        ? 'One of the movie already exists'
        : 'Server down please try again later',
    });
  }
};

//@TODO try out cursor based search (in this case its fine since we are dealing with small amount can be used in filters)
//search functionality
export const searchMovies = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get query from params
    const { text } = req.query;

    // get pagination params
    const { limit, start } = getPaginationParams(
      req.query,
      GET_ALL_MOVIES_LIMITS
    );

    //search pipeline (atlas search)
    const pipeline = [
      {
        $search: {
          index: MOVIE_SEARCH_INDEX,
          text: {
            query: text,
            path: ['title'],
          },
        },
      },
    ];

    // search for movies
    const movies = await Movie.aggregate(pipeline).limit(limit).skip(start);

    // return the movies
    res.status(200).json({
      success: true,
      data: {
        movies,
        pagination: {
          limit,
          start,
        },
      },
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//get movies with filters

export const getMoviesWithFilters = async (
  req: ValidatedRequest<MovieFiltersZodType>,
  res: Response
) => {
  try {
    // destructure the filters from validated data
    const {
      languages,
      page,
      limit,
      status,
      genre,
      tags,
      averageRating,
      ageRating,
      runTime,
      releaseDate
    } = req.validatedData!;

    //define filters and pipeline
    const filters: any[] = [];
    const pipeline: any[] = [];

    //@TODO mandate to store all the languages in lower case for better search
    //check if languages is defined
    if (languages) {
      //push language filter to filters
      filters.push({
        in: {
          value: languages,
          path: 'languages',
        },
      });
    }

    //check if status is defined
    if (status) {
      //push status filter to filters
      filters.push({
        in: {
          value: status,
          path: 'status',
        },
      });
    }

    //if genre is defined
    if (genre) {
      //push genre filter to filters
      filters.push({
        in: {
          value: genre,
          path: 'genre',
        },
      });
    }

    //if tags is defined
    if (tags) {
      //push tags filter to filters
      filters.push({
        in: {
          value: tags,
          path: 'tags',
        },
      });
    }

    if (runTime) {
      //push run time filter to filters
      filters.push({
        range: {
          path: 'runTime',
          ...runTime,
        },
      });
    }

    //if average rating is present
    if (averageRating) {
      //push average rating filter to filters
      filters.push({
        range: {
          path: 'averageRating',
          gte: averageRating,
        },
      });
    }

    //if age rating is present
    if (ageRating) {
      //push age rating filter to filters
      filters.push({
        range: {
          path: 'ageRating',
          ...ageRating,
        },
      });
    }

    //if releaseDate is present
    if (releaseDate) {
      //push release date filter to filters
      filters.push({
        range: {
          path: 'releaseDate',
          ...releaseDate,
        },
      });
    }

    // build pipeline if filters are defined
    if (filters.length > 0) {
      pipeline.push({
        $search: {
          index: 'movie_filters',
          compound: {
            filter: filters,
          },
        },
      });
    }
    //Use $facet to get both paginated data and total count in one query
    const skip = (page - 1) * limit;
    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'total' }],
      },
    });

    //get the data from db
    const result = await Movie.aggregate(pipeline);

    // extract the data , total count and pagination details
    const data = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.total || 0;
    const pagination = getPaginationResponse(totalCount, limit, skip);

    // return the data
    res.status(200).json({
      success: true,
      data: {
        movies: data,
        pagination,
      },
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};
