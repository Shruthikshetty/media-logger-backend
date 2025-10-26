/**
 * @file contains the movie controllers
 */
import { NextFunction, Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { handleError } from '../common/utils/handle-error';
import { AddMovieZodSchemaType } from '../common/validation-schema/movie/add-movie';
import Movie from '../models/movie.model';
import {
  isDuplicateKeyError,
  isMongoIdValid,
} from '../common/utils/mongo-errors';
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
import {
  appendNewDoc,
  appendOldAndNewDoc,
  appendOldDoc,
} from '../common/utils/history-utils';

// controller to add a new movie
export const addMovie = async (
  req: ValidatedRequest<AddMovieZodSchemaType>,
  res: Response,
  next: NextFunction
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

    res.status(201).json({
      success: true,
      data: savedMovie,
      message: 'Movie created successfully',
    });
    // set the added movie for history
    appendNewDoc(res, savedMovie);
    next();
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

    // validate id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid movie id', statusCode: 400 });
      return;
    }

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
  res: Response,
  next: NextFunction
) => {
  try {
    // get id from params
    const { id } = req.params;

    // validate id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid movie id', statusCode: 400 });
      return;
    }

    // delete the movie
    const deletedMovie = await Movie.findByIdAndDelete(id).lean().exec();

    // in case movie is not deleted
    if (!deletedMovie) {
      handleError(res, { message: 'Movie does not exist', statusCode: 404 });
      return;
    }

    // return the deleted movie
    res.status(200).json({
      success: true,
      data: deletedMovie,
      message: 'Movie deleted successfully',
    });
    // set the deleted movie for history
    appendOldDoc(res, deletedMovie);
    next();
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
  res: Response,
  next: NextFunction
) => {
  try {
    // get id from params
    const { id } = req.params;

    // validate id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid movie id', statusCode: 400 });
      return;
    }

    // check if the movie exists
    const oldMovie = await Movie.findById(id).lean().exec();
    // in case movie is not found
    if (!oldMovie) {
      handleError(res, { message: 'Movie does not exist', statusCode: 404 });
      return;
    }

    // update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.validatedData!, {
      new: true,
      runValidators: true,
      context: 'query',
    })
      .lean()
      .exec();

    // in case movie is not updated
    if (!updatedMovie) {
      handleError(res, { message: 'Failed to update movie', statusCode: 500 });
      return;
    }

    // return the updated movie
    res.status(200).json({
      success: true,
      data: updatedMovie,
      message: 'Movie updated successfully',
    });

    // set the updated movie for history
    appendOldAndNewDoc({
      res,
      oldValue: oldMovie,
      newValue: updatedMovie,
    });
    // call next middleware
    next();
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
      message: isDuplicateKeyError(err)
        ? 'Movie already exists'
        : 'Server down please try again later',
    });
  }
};

//controller to bulk delete movies by taking list of ids
export const bulkDeleteMovies = async (
  req: ValidatedRequest<BulkDeleteMovieZodSchemaType>,
  res: Response,
  next: NextFunction
) => {
  try {
    // get movie ids
    const movieIds = req.validatedData!.movieIds;

    //get all existing movie  by ids
    const moviesToDelete = await Movie.find({
      _id: { $in: movieIds },
    })
      .lean()
      .exec();

    //in case no movies are found
    if (moviesToDelete.length === 0) {
      handleError(res, {
        message: 'No movies found for the provided IDs',
        statusCode: 404,
      });
      return;
    }

    //delete all the movies that are passed
    const deletedResult = await Movie.deleteMany({
      _id: {
        $in: movieIds,
      },
    });

    // return the deleted movies
    res.status(200).json({
      success: true,
      data: {
        deletedCount: deletedResult.deletedCount,
      },
      message: `${deletedResult.deletedCount} movie(s) deleted successfully`,
    });

    // set the deleted movies for history
    appendOldDoc(res, moviesToDelete);
    next();
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
  res: Response,
  next: NextFunction
) => {
  try {
    // continue inserting even if there are errors
    const savedMovies = await Movie.insertMany(req.validatedData!, {
      ordered: false,
      throwOnValidationError: true, // throw error if validation fails
    });

    // return the added movies
    res.status(201).json({
      success: true,
      data: {
        added: savedMovies,
        notAdded: [],
      },
      message: 'Movies added successfully',
    });

    // set the added movies for history
    appendNewDoc(res, savedMovies);
    next();
  } catch (err: any) {
    // failed (duplicate) docs
    const notAdded = err?.writeErrors
      ? err.writeErrors.map((e: any) => e.err?.op ?? e.err?.doc ?? {})
      : [];

    // successfully inserted docs
    const added = err?.insertedDocs || [];

    // in case movies are added partially
    if (added.length > 0) {
      res.status(207).json({
        success: true,
        data: {
          added,
          notAdded,
        },
        message: 'Movies partially added successfully',
      });
      // set the added movies for history
      appendNewDoc(res, added);
      next();
      return;
    }

    handleError(res, {
      error: err,
      message: isDuplicateKeyError(err)
        ? 'All movies already exist'
        : 'Server down please try again later',
      statusCode: isDuplicateKeyError(err) ? 409 : 500,
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
    const movies = await Movie.aggregate(pipeline).skip(start).limit(limit);

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
      releaseDate,
      searchText,
    } = req.validatedData!;

    //define filters and pipeline
    const pipeline: any[] = [];
    const searchClauses: any = {
      must: [],
      filter: [],
    };

    //search has to be first in pipeline
    if (searchText) {
      //push search text to pipeline
      searchClauses.must.push({
        text: {
          query: searchText,
          path: ['title'],
        },
      });
    }

    //check if languages is defined
    if (languages) {
      //push language filter to filters
      searchClauses.filter.push({
        in: {
          value: languages,
          path: 'languages',
        },
      });
    }

    //check if status is defined
    if (status) {
      //push status filter to filters
      searchClauses.filter.push({
        in: {
          value: status,
          path: 'status',
        },
      });
    }

    //if genre is defined
    if (genre) {
      //push genre filter to filters
      searchClauses.filter.push({
        in: {
          value: genre,
          path: 'genre',
        },
      });
    }

    //if tags is defined
    if (tags) {
      //push tags filter to filters
      searchClauses.filter.push({
        in: {
          value: tags,
          path: 'tags',
        },
      });
    }

    if (runTime) {
      //push run time filter to filters
      searchClauses.filter.push({
        range: {
          path: 'runTime',
          ...runTime,
        },
      });
    }

    //if average rating is present
    if (averageRating) {
      //push average rating filter to filters
      searchClauses.filter.push({
        range: {
          path: 'averageRating',
          gte: averageRating,
        },
      });
    }

    //if age rating is present
    if (ageRating) {
      //push age rating filter to filters
      searchClauses.filter.push({
        range: {
          path: 'ageRating',
          ...ageRating,
        },
      });
    }

    //if releaseDate is present
    if (releaseDate) {
      //push release date filter to filters
      searchClauses.filter.push({
        range: {
          path: 'releaseDate',
          ...releaseDate,
        },
      });
    }

    // build pipeline if filters are defined
    // Only add a $search stage if there's something to search or filter by
    const compound: any = {};
    if (searchClauses.must.length) compound.must = searchClauses.must;
    if (searchClauses.filter.length) compound.filter = searchClauses.filter;

    if (Object.keys(compound).length) {
      pipeline.push({
        $search: { index: MOVIE_SEARCH_INDEX, compound },
      });
    }

    // Ensure that the results are sorted by createdAt in descending order
    pipeline.push({ $sort: { createdAt: -1 } });

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
