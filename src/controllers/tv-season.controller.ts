/**
 * @file holds the controller for tv season
 */

// import
import { handleError } from '../common/utils/handle-error';
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { AddSeasonZodType } from '../common/validation-schema/tv-show/add-season';
import { startSession } from 'mongoose';
import Season from '../models/tv-season';
import Episode, { IEpisode } from '../models/tv-episode';
import TVShow from '../models/tv-show.mode';

//controller to add a tv season to a tv show
export const addSeason = async (
  req: ValidatedRequest<AddSeasonZodType>,
  res: Response
) => {
  // create a mongo transaction session
  const session = await startSession();
  //start transaction
  session.startTransaction();
  try {
    // get the validated data from request
    const { episodes, ...seasonData } = req.validatedData!;

    // check if the tv show exists
    const tvShow = await TVShow.findOne({ _id: seasonData.tvShow }).lean().exec();

    // in case tv show is not found
    if (!tvShow) {
      throw new Error('Tv show not found');
    }

    // create a new season
    const newSeason = new Season(seasonData);

    // save the create season
    const saveSeason = await newSeason.save({ session });

    // in case season is not saved
    if (!saveSeason) {
      throw new Error('Season creation failed');
    }

    // in case there are episodes
    let savedEpisodes: IEpisode[] = [];

    if (episodes && episodes.length > 0) {
      for (const episodeData of episodes) {
        // create a new episode
        const newEpisode = new Episode({
          season: saveSeason._id,
          ...episodeData,
        });

        // save the create episode
        const saveEpisode = await newEpisode.save({ session });

        // in case episode is not saved
        if (!saveEpisode) {
          throw new Error(`${episodeData.title}episode creation failed`);
        }
        savedEpisodes.push(saveEpisode);
      }
    }

    // commit the transaction
    await session.commitTransaction();

    //send the response
    res.status(200).json({
      success: true,
      data:  {...saveSeason.toObject() , episodes: savedEpisodes},
      message: 'Season added successfully',
    });
  } catch (err: any) {
    // if any error abort the transaction
    await session.abortTransaction();

    // handle unexpected error
    handleError(res, {
      error: err,
      message: err?.message,
    });
  } finally {
    //end session
    await session.endSession();
  }
};
