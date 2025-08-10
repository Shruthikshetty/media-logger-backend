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
import { getSeasonDetailsById } from '../common/utils/get-season';
import { ApiError } from '../common/utils/api-error';
import { isMongoIdValid } from '../common/utils/mongo-errors';
import { UpdateSeasonZodType } from '../common/validation-schema/tv-show/update-season';

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
    const tvShow = await TVShow.findOne({ _id: seasonData.tvShow })
      .lean()
      .exec();

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
      data: { ...saveSeason.toObject(), episodes: savedEpisodes },
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

// controller to get a season by id
export const getSeasonById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;

    // get the season details
    const season = await getSeasonDetailsById(
      id,
      req.query.fullDetails as string
    );

    //if season is not found
    if (!season) {
      throw new ApiError(404, 'Season not found');
    }

    // send the response
    res.status(200).json({ success: true, data: season });
  } catch (err: any) {
    // handle unexpected error
    handleError(res, {
      error: err,
      message: err?.message,
      statusCode: err?.statusCode,
    });
  }
};

// controller to update a season
export const updateSeason = async (
  req: ValidatedRequest<UpdateSeasonZodType>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;
    // check if id is a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid season id', statusCode: 400 });
      return;
    }

    //find and update the season by id
    const updatedSeason = await Season.findByIdAndUpdate(
      id,
      req.validatedData!,
      {
        new: true,
      }
    )
      .lean()
      .exec();

    // in case season is not updated
    if (!updatedSeason) {
      handleError(res, { message: 'Season does not exist', statusCode: 404 });
      return;
    }

    // return the updated season
    res.status(200).json({
      success: true,
      data: updatedSeason,
      message: 'Season updated successfully',
    });
  } catch (err: any) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//delete a season by id
export const deleteSeasonById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  // create a mongo transaction session
  const session = await startSession();
  //start transaction
  session.startTransaction();
  try {
    // get the id from params
    const { id } = req.params;

    // check if id is a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid season id', statusCode: 400 });
      return;
    }

    // delete the season by id
    const deletedSeason = await Season.findByIdAndDelete(id, { session })
      .lean()
      .exec();

    // in case season is not deleted
    if (!deletedSeason) {
      handleError(res, { message: 'Season dose not exist' });
      return;
    }

    // delete all the episodes of the season
    const deletedEpisodes = await Episode.deleteMany(
      { season: id },
      { session }
    )
      .lean()
      .exec();

    // commit the transaction
    await session.commitTransaction();

    // return the deleted season
    res.status(200).json({
      success: true,
      data: {
        ...deletedSeason,
        episodes: deletedEpisodes,
      },
      message: 'Season and associated episodes deleted successfully',
    });
  } catch (err) {
    // in case of error abort the transaction
    await session.abortTransaction();
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  } finally {
    //end session
    await session.endSession();
  }
};
