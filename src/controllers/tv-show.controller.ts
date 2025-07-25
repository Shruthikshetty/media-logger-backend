/**
 * This @file contains the controller related to tv-show
 */

import { handleError } from '../common/utils/handle-error';
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { AddTvShowZodType } from '../common/validation-schema/tv-show/add-tv-show';
import TVShow, { ITVShow } from '../models/tv-show.mode';
import Season, { ISeason } from '../models/tv-season';
import Episode, { IEpisode } from '../models/tv-episode';
import { startSession } from 'mongoose';
import {
  isDuplicateKeyError,
  isMongoIdValid,
} from '../common/utils/mongo-errors';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import { GET_ALL_TV_SHOW_LIMITS } from '../common/constants/config.constants';
import {
  getTvShowDetails,
  getSeasonsWithEpisodes,
} from '../common/utils/get-tv-show';
import { UpdateTvShowZodType } from '../common/validation-schema/tv-show/update-tv-show';

// controller to add a new tv show
export const addTvShow = async (
  req: ValidatedRequest<AddTvShowZodType>,
  res: Response
) => {
  // Start a Mongoose session for the transaction
  const session = await startSession();
  session.startTransaction();

  try {
    //get validated data
    const { seasons, ...restTvDetails } = req.validatedData!;

    // create a new tv show
    const newTvShow = new TVShow(restTvDetails);

    // save the tv show
    const saveTvShow = await newTvShow.save({ session });

    // in case tv show is not saved
    if (!saveTvShow) {
      throw new Error('Tv show creation failed');
    }

    // in case there are seasons
    let savedSeasons: ISeason[] = [];
    let savedEpisodes: IEpisode[] = [];

    if (seasons && seasons.length > 0) {
      for (const seasonData of seasons) {
        // extract episodes
        const { episodes, ...seasonDetails } = seasonData;
        // create a new season
        const newSeason = new Season({
          tvShow: saveTvShow._id,
          ...seasonDetails,
        });
        // save the season
        const savedSeason = await newSeason.save({ session });

        // in case season is not saved
        if (!savedSeason) {
          throw new Error(`${seasonData.title} creation failed`);
        }

        savedSeasons.push(savedSeason);

        // in case there are episodes
        if (episodes && episodes.length > 0) {
          for (const episodeData of episodes) {
            // create a new episode
            const newEpisode = new Episode({
              season: savedSeason._id,
              ...episodeData,
            });
            // save the episode
            const savedEpisode = await newEpisode.save({ session });
            if (!savedEpisode) {
              throw new Error(`${episodeData.title} creation failed`);
            }
            savedEpisodes.push(savedEpisode);
          }
        }
      }
    }

    // If all operations were successful, commit the transaction
    await session.commitTransaction();

    // return the saved tv show
    res.status(200).json({
      success: true,
      data: {
        /**
         * return the saved tv show with seasons and episodes
         * tvShow:{
         *  ...,
         *  seasons:[
         *    {
         *    ...,
         *    episodes:[
         *      ...
         *    }
         *  ]
         * }
         */
        tvShow: {
          ...saveTvShow.toObject(),
          seasons: savedSeasons.map((season) => ({
            ...season.toObject(),
            episodes: savedEpisodes.filter(
              (episode) =>
                episode.season.toString() === season.toObject()._id.toString()
            ),
          })),
        },
      },
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
    console.log(id);
    // get the tv show details
    const tvShow = await TVShow.findById(id).lean<ITVShow>().exec();
    console.log(tvShow);
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
