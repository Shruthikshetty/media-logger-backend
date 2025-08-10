/**
 * @file holds the controller related to tv-episode
 */

import { getEpisodeDetailsById } from '../common/utils/get-episode';
import { handleError } from '../common/utils/handle-error';
import { isMongoIdValid } from '../common/utils/mongo-errors';
import { AddEpisodeZodType } from '../common/validation-schema/tv-show/add-episode';
import { UpdateEpisodeZodType } from '../common/validation-schema/tv-show/update-episode';
import Episode from '../models/tv-episode';
import Season from '../models/tv-season';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';

//controller to add a episode to a season
export const addEpisode = async (
  req: ValidatedRequest<AddEpisodeZodType>,
  res: Response
) => {
  try {
    // check if the season exists
    const season = await Season.findById(req.validatedData!.season)
      .lean()
      .exec();
    if (!season) {
      throw new Error('Season not found');
    }

    //create a new episode
    const newEpisode = new Episode(req.validatedData!);

    //save the episode
    const savedEpisode = await newEpisode.save();

    //return the saved episode
    res.status(201).json({
      success: true,
      data: savedEpisode,
      message: 'Episode created successfully',
    });
  } catch (err: any) {
    //handle unexpected error
    handleError(res, {
      error: err,
      message: err?.message,
    });
  }
};

//controller to get a episode by id
export const getEpisodeById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;
    // if id is not a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid episode id', statusCode: 400 });
      return;
    }
    //get query param fullDetails
    const { fullDetails } = req.query;

    //find the episode by id
    const episode = await getEpisodeDetailsById(id, fullDetails as string);

    //in case episode is not found
    if (!episode) {
      handleError(res, { message: 'Episode not found', statusCode: 404 });
      return;
    }

    // Send response
    res.status(200).json({
      success: true,
      data: episode,
    });
  } catch (err: any) {
    //handle unexpected error
    handleError(res, {
      error: err,
      message: err?.message,
      statusCode: err?.statusCode,
    });
  }
};

//controller to delete a episode by id
export const deleteEpisodeById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;

    // if id is not a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid episode id', statusCode: 400 });
      return;
    }

    //delete the episode
    const deletedEpisode = await Episode.findByIdAndDelete(id).lean().exec();

    // in case episode is not deleted
    if (!deletedEpisode) {
      handleError(res, { message: 'Episode dose not exist', statusCode: 404 });
      return;
    }

    // return the deleted episode
    res.status(200).json({
      success: true,
      data: deletedEpisode,
      message: 'Episode deleted successfully',
    });
  } catch (err: any) {
    //handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller to update a episode by id
export const updateEpisodeById = async (
  req: ValidatedRequest<UpdateEpisodeZodType>,
  res: Response
) => {
  try {
    // get id from params
    const { id } = req.params;

    // check if id is a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid episode id', statusCode: 400 });
      return;
    }

    //find and update the episode by id
    const updatedEpisode = await Episode.findByIdAndUpdate(
      id,
      req.validatedData!,
      {
        new: true,
      }
    )
      .lean()
      .exec();

    // in case episode is not updated
    if (!updatedEpisode) {
      handleError(res, { message: 'Episode dose not exist' });
      return;
    }

    // return the updated episode
    res.status(200).json({
      success: true,
      data: updatedEpisode,
      message: 'Episode updated successfully',
    });
  } catch (err: any) {
    //handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};
