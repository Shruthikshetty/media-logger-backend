/**
 * This @file contains all the controllers related to media entry
 */

import { handleError } from '../common/utils/handle-error';
import { isDuplicateKeyError } from '../common/utils/mongo-errors';
import { AddMediaEntryZodSchemaType } from '../common/validation-schema/media-entry/add-media-entry';
import MediaEntry from '../models/media-entry';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';

//controller to add a new media entry
export const addNewMediaEntry = async (
  req: ValidatedRequest<AddMediaEntryZodSchemaType>,
  res: Response
) => {
  try {
    //get validated data
    const data = req.validatedData!;

    // create a new media entry
    const newMediaEntry = new MediaEntry({
      user: req.userData!._id,
      ...data,
    });

    // save the media entry
    const savedMediaEntry = await newMediaEntry.save();

    // in case media entry is not saved
    if (!savedMediaEntry) {
      handleError(res, { message: 'Media entry creation failed' });
      return;
    }

    // return the saved media entry
    res.status(201).json({
      success: true,
      data: savedMediaEntry,
      message: 'Media entry created successfully',
    });
  } catch (err) {
    const isDuplicate = isDuplicateKeyError(err);
    //handle unexpected errors
    handleError(res, {
      error: err,
      message: isDuplicate
        ? 'You have already logged this media to you collection.'
        : 'Media entry creation failed',
    });
  }
};
