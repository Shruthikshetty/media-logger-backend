/**
 * This @file contains all the controllers related to media entry
 */

import { GET_ALL_MEDIA_ENTRY_LIMITS } from '../common/constants/config.constants';
import { handleError } from '../common/utils/handle-error';
import { isDuplicateKeyError } from '../common/utils/mongo-errors';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import { AddMediaEntryZodSchemaType } from '../common/validation-schema/media-entry/add-media-entry';
import {
  GetAllUserMediaEntrySchema,
  GetAllUserMediaEntrySchemaType,
} from '../common/validation-schema/media-entry/get-media-entry';
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

//get all the user media entries
export const getAllUserMediaEntries = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get pagination params
    const { limit, start } = getPaginationParams(
      req.query,
      GET_ALL_MEDIA_ENTRY_LIMITS
    );
    //get user id
    const userId = req.userData?._id;
    // validate optional fields
    const optionalQuery: GetAllUserMediaEntrySchemaType =
      GetAllUserMediaEntrySchema.safeParse(req.query)?.data;
    // build the query
    const query = optionalQuery
      ? {
          ...optionalQuery,
          user: userId,
        }
      : {
          user: userId,
        };

    //get all the user media entries
    const [mediaEntries, total] = await Promise.all([
      MediaEntry.find(query).limit(limit).skip(start).lean().exec(),
      MediaEntry.countDocuments(query),
    ]);

    // get pagination details
    const pagination = getPaginationResponse(total, limit, start);

    // return the media entries
    res.status(200).json({
      success: true,
      data: {
        mediaEntries,
        pagination: pagination,
      },
    });
  } catch (err) {
    //handle unexpected errors
    handleError(res, { error: err });
  }
};
