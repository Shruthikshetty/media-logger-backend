/**
 * @file holds the controller related to tv-episode
 */

import { handleError } from '../common/utils/handle-error';
import { AddEpisodeZodType } from '../common/validation-schema/tv-show/add-episode';
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
    const season =await  Season.findById(req.validatedData!.season).lean().exec();
    if (!season) {
      throw new Error('Season not found');
    }

    //create a new episode
    const newEpisode = new Episode(req.validatedData!);

    //save the episode
    const savedEpisode = await newEpisode.save();

    //return the saved episode
    res.status(200).json({
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
