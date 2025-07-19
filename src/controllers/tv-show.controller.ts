/**
 * This @file contains the controller related to tv-show
 */

import { handleError } from '../common/utils/handle-error';
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { AddTvShowZodType } from '../common/validation-schema/tv-show/add-tv-show';
import TVShow from '../models/tv-show.mode';
import Season, { ISeason } from '../models/tv-season';
import Episode, { IEpisode } from '../models/tv-episode';
import { startSession } from 'mongoose';
import { isDuplicateKeyError } from '../common/utils/mongo-errors';

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
        tvShow: saveTvShow,
        seasons: savedSeasons,
        episodes: savedEpisodes,
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
