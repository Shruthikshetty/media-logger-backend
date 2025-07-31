/**
 * This @file contains the controller related to tv-show
 */

import { handleError } from '../common/utils/handle-error';
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { AddTvShowZodType } from '../common/validation-schema/tv-show/add-tv-show';
import TVShow, { ITVShow } from '../models/tv-show.mode';
import { startSession } from 'mongoose';
import {
  isDuplicateKeyError,
  isMongoIdValid,
} from '../common/utils/mongo-errors';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import {
  GET_ALL_TV_SHOW_LIMITS,
  TV_SHOW_SEARCH_INDEX,
} from '../common/constants/config.constants';
import {
  getTvShowDetails,
  getSeasonsWithEpisodes,
} from '../common/utils/get-tv-show';
import { UpdateTvShowZodType } from '../common/validation-schema/tv-show/update-tv-show';
import { BulkDeleteTvShowZodSchemaType } from '../common/validation-schema/tv-show/bulk-delete-tv-show';
import { deleteTvShow } from '../common/utils/delete-tv-show';
import { FilterTvShowZodType } from '../common/validation-schema/tv-show/tv-show-filter';
import { addSingleTvShow } from '../common/utils/add-tv-show';
import { BulkAddTvShowZodSchemaType } from '../common/validation-schema/tv-show/bulk-add-tv-show';
import { ISeason } from '../models/tv-season';

// controller to add a new tv show
export const addTvShow = async (
  req: ValidatedRequest<AddTvShowZodType>,
  res: Response
) => {
  // Start a Mongoose session for the transaction
  const session = await startSession();
  session.startTransaction();

  try {
    // save the tv show
    const savedTvShow = await addSingleTvShow(req.validatedData!, session);

    // If all operations were successful, commit the transaction
    await session.commitTransaction();

    // return the saved tv show
    res.status(200).json({
      success: true,
      data: savedTvShow,
      message: 'Tv show created successfully',
    });
  } catch (error: any) {
    // If any error occurred, abort the entire transaction
    await session.abortTransaction();
    //handle unexpected errors
    handleError(res, {
      error: error,
      message:
        error?.message || isDuplicateKeyError(error)
          ? 'Tv show already exists'
          : 'Server down please try again later',
    });
  } finally {
    // Finally, end the session
    session.endSession();
  }
};

// get all the tv show
export const getAllTvShows = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  // get pagination params
  const { limit, start } = getPaginationParams(
    req.query,
    GET_ALL_TV_SHOW_LIMITS
  );

  try {
    //get all the tv shows
    const [tvShows, total] = await getTvShowDetails(
      req.query.fullDetails as string,
      start,
      limit
    );

    // get pagination details
    const pagination = getPaginationResponse(total as number, limit, start);
    // return the tv shows
    res.status(200).json({
      success: true,
      data: {
        tvShows,
        pagination,
      },
    });
  } catch (error) {
    // handle unexpected error
    handleError(res, { error: error });
  }
};

//get tv show by id
export const getTvShowById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;

    // get the tv show details
    const tvShow = await TVShow.findById(id).lean<ITVShow>().exec();

    // in case tv show is not found
    if (!tvShow) {
      handleError(res, { message: 'Tv show not found', statusCode: 404 });
      return;
    }

    // add episodes to each season
    const seasonsWithEpisodes = await getSeasonsWithEpisodes(
      (tvShow as any)._id
    );

    // return the tv show with seasons and episodes
    res.status(200).json({
      success: true,
      data: {
        tvShow: {
          ...tvShow,
          seasons: seasonsWithEpisodes,
        },
      },
    });
  } catch (error) {
    // handle unexpected error
    handleError(res, { error: error });
  }
};

// controller to update tv show by id
export const updateTvShowById = async (
  req: ValidatedRequest<UpdateTvShowZodType>,
  res: Response
) => {
  try {
    //extract id from params
    const { id } = req.params;
    // check if id is a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid tv show id', statusCode: 400 });
      return;
    }
    //update the tv show by id
    const updatedTvShow = await TVShow.findByIdAndUpdate(
      id,
      req.validatedData!,
      { new: true }
    )
      .lean()
      .exec();

    // in case tv show is not updated
    if (!updatedTvShow) {
      handleError(res, { message: 'Tv show not found', statusCode: 404 });
      return;
    }
    // return the updated tv show
    res.status(200).json({
      success: true,
      data: {
        tvShow: updatedTvShow,
      },
      message: 'Tv show updated successfully',
    });
  } catch (error) {
    // handle unexpected error
    handleError(res, { error: error });
  }
};

// controller to delete tv show by id
export const deleteTvShowById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  //initialize transaction session
  const session = await startSession();
  //start transaction
  session.startTransaction();
  try {
    // destructure id
    const { id } = req.params;

    //check if the id is a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid tv show id', statusCode: 400 });
      return;
    }

    // delete tv show
    const { deletedCount } = await deleteTvShow(id, session);

    //commit the transaction
    await session.commitTransaction();

    // return the deleted tv show count
    res.status(200).json({
      success: true,
      data: {
        deletedCount,
      },
      message: 'Tv show deleted successfully',
    });
  } catch (err: any) {
    session.abortTransaction();
    //handle unexpected error
    handleError(res, {
      error: err,
      statusCode: err?.statusCode,
      message: err?.message,
    });
  } finally {
    session.endSession();
  }
};

//controller to bulk delete tv show
export const bulkDeleteTvShow = async (
  req: ValidatedRequest<BulkDeleteTvShowZodSchemaType>,
  res: Response
) => {
  // create a mongo transaction session
  const session = await startSession();
  //start transaction
  session.startTransaction();
  try {
    // get the ids from validated data
    const { tvShowIds } = req.validatedData!;

    const deleteCount = {
      tvShow: 0,
      seasons: 0,
      episodes: 0,
    };

    for (const id of tvShowIds) {
      // delete tv show
      const { deletedCount: receivedDeletedCount } = await deleteTvShow(
        id,
        session
      );
      //update count
      deleteCount.tvShow += receivedDeletedCount.tvShow;
      deleteCount.seasons += receivedDeletedCount.seasons;
      deleteCount.episodes += receivedDeletedCount.episodes;
    }
    //commit the transaction
    await session.commitTransaction();

    // return the deleted tv show count
    res.status(200).json({
      success: true,
      data: {
        deleteCount,
      },
      message: "Tv show's deleted successfully",
    });
  } catch (err: any) {
    session.abortTransaction();
    //handle unexpected error
    handleError(res, {
      error: err,
      statusCode: err?.statusCode,
      message: err?.message,
    });
  } finally {
    //end session
    await session.endSession();
  }
};

//controller for search tv show
export const searchTvShow = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    //get the search text from query params
    const { text } = req.query;

    //get pagination params
    const { limit, start } = getPaginationParams(
      req.query,
      GET_ALL_TV_SHOW_LIMITS
    );

    //search pipe line
    const pipeline = [
      {
        $search: {
          index: TV_SHOW_SEARCH_INDEX,
          text: {
            query: text,
            path: ['title'],
          },
        },
      },
    ];

    //get the tv shows
    const tvShows = await TVShow.aggregate(pipeline)
      .limit(limit)
      .skip(start)
      .exec();

    //send response
    res.status(200).json({
      success: true,
      data: {
        tvShows,
      },
    });
  } catch (error) {
    // handle unexpected error
    handleError(res, { error: error });
  }
};

//controller for filter tv show
export const filterTvShow = async (
  req: ValidatedRequest<FilterTvShowZodType>,
  res: Response
) => {
  try {
    //destructure validated data
    const {
      genre,
      limit,
      page,
      languages,
      status,
      averageRating,
      releaseDate,
      runTime,
      tags,
      totalEpisodes,
      totalSeasons,
    } = req.validatedData!;

    //define filters and pipeline
    const filters: any[] = [];
    const pipeline: any[] = [];

    //check if genre is defined
    if (genre) {
      filters.push({
        in: {
          path: 'genre',
          value: genre,
        },
      });
    }

    //check if tags is defined
    if (tags) {
      filters.push({
        in: {
          path: 'tags',
          value: tags,
        },
      });
    }

    //check if status is defined
    if (status) {
      filters.push({
        in: {
          path: 'status',
          value: status,
        },
      });
    }

    //check if averageRating is defined
    if (averageRating) {
      filters.push({
        range: {
          path: 'averageRating',
          gte: averageRating,
        },
      });
    }

    //check if releaseDate is defined
    if (releaseDate) {
      filters.push({
        range: {
          path: 'releaseDate',
          ...releaseDate,
        },
      });
    }

    //check if runTime is defined
    if (runTime) {
      filters.push({
        range: {
          path: 'runTime',
          ...runTime,
        },
      });
    }

    //check if totalEpisodes is defined
    if (totalEpisodes) {
      filters.push({
        range: {
          path: 'totalEpisodes',
          ...totalEpisodes,
        },
      });
    }

    //check if totalSeasons is defined
    if (totalSeasons) {
      filters.push({
        range: {
          path: 'totalSeasons',
          ...totalSeasons,
        },
      });
    }

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

    //if filters are defined
    if (filters.length > 0) {
      pipeline.push({
        $search: {
          index: TV_SHOW_SEARCH_INDEX,
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

    // get the data from db
    const result = await TVShow.aggregate(pipeline);

    // extract the data , pagination and total count from the result
    const data = result[0]?.data;
    const totalCount = result[0]?.totalCount[0]?.total || 0;
    const pagination = getPaginationResponse(totalCount, limit, skip);

    //send response
    res.status(200).json({
      success: true,
      data: {
        tvShows: data,
        pagination,
      },
    });
  } catch (error) {
    // handle unexpected error
    handleError(res, { error: error });
  }
};

//controller to bulk add tv show
export const bulkAddTvShow = async (
  req: ValidatedRequest<BulkAddTvShowZodSchemaType>,
  res: Response
) => {
  //start a mongoose transaction session
  const session = await startSession();
  //start transaction
  session.startTransaction();
  try {
    //destructure validated data
    const tvShows = req.validatedData!;
    const savedTvShows: (Partial<ITVShow> & { seasons: ISeason[] })[] = [];

    //add all the tv shows to the db
    for (const tvShow of tvShows) {
      //save the tv show
      const savedTvShow = await addSingleTvShow(tvShow, session);
      savedTvShows.push(savedTvShow);
    }

    //commit the transaction if all the tv shows are saved
    await session.commitTransaction();
    //send response

    res.status(200).json({
      success: true,
      data: savedTvShows,
      message: 'Tv shows created successfully',
    });
  } catch (error: any) {
    // handle unexpected error
    handleError(res, {
      error: error,
      message:
        error?.message || isDuplicateKeyError(error)
          ? 'One of the tv show already exists'
          : 'Server down please try again later',
    });
  } finally {
    //end the session
    session.endSession();
  }
};
