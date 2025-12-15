/**
 * This @file contains all the controllers related to media entry
 */

import { GET_ALL_MEDIA_ENTRY_LIMITS } from '../common/constants/config.constants';
import { handleError } from '../common/utils/handle-error';
import {
  isDuplicateKeyError,
  isMongoIdValid,
} from '../common/utils/mongo-errors';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import { validateDataUsingZod } from '../common/utils/validate-data';
import { AddMediaEntryZodSchemaType } from '../common/validation-schema/media-entry/add-media-entry';
import {
  GetAllUserMediaEntrySchema,
  GetAllUserMediaEntrySchemaType,
  GetSingleMediaByIdSchema,
  GetSingleMediaByIdSchemaType,
} from '../common/validation-schema/media-entry/get-media-entry';
import { UpdateMediaEntrySchemaType } from '../common/validation-schema/media-entry/update-media-entry';
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
      MediaEntry.find(query)
        .limit(limit)
        .skip(start)
        .populate('mediaItem')
        .lean()
        .exec(),
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

//get media entry by id
export const getMediaEntryById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get media entry id
    const { id } = req.params;
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid media entry id', statusCode: 400 });
      return;
    }

    // get the media entry
    const mediaEntry = await MediaEntry.findOne({
      _id: id,
      user: req.userData?._id,
    })
      .populate('mediaItem')
      .lean()
      .exec();

    // in case media entry is not found
    if (!mediaEntry) {
      handleError(res, { message: 'Media entry not found', statusCode: 404 });
      return;
    }

    // return the media entry
    res.status(200).json({
      success: true,
      data: mediaEntry,
    });
  } catch (err) {
    //handle unexpected errors
    handleError(res, { error: err });
  }
};

//get by media id
export const getMediaEntryByMedia = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // validate and get mediaItem , onModel from query params
    const validatedQuery = validateDataUsingZod<GetSingleMediaByIdSchemaType>(
      GetSingleMediaByIdSchema,
      req.query,
      res
    );
    //return if validation fails
    if (!validatedQuery) return;

    const { mediaItem, onModel } = validatedQuery;
    // get the media entry
    const mediaEntry = await MediaEntry.findOne({
      user: req.userData?._id,
      onModel,
      mediaItem,
    })
      .populate('mediaItem')
      .lean()
      .exec();

    // in case media entry is not found
    if (!mediaEntry) {
      handleError(res, { message: 'Media entry not found', statusCode: 404 });
      return;
    }

    // return the media entry
    res.status(200).json({
      success: true,
      data: mediaEntry,
    });
  } catch (err) {
    //handle unexpected errors
    handleError(res, { error: err });
  }
};

//update a user media entry
export const updateUserMediaEntry = async (
  req: ValidatedRequest<UpdateMediaEntrySchemaType>,
  res: Response
) => {
  try {
    // get media entry id
    const { id } = req.params;
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid media entry id', statusCode: 400 });
      return;
    }

    // update the media entry
    const updatedMediaEntry = await MediaEntry.findOneAndUpdate(
      { _id: id, user: req.userData?._id },
      req.validatedData!, // new data
      {
        new: true,
      }
    )
      .lean()
      .exec();

    // in case media entry is not updated
    if (!updatedMediaEntry) {
      handleError(res, { message: 'Media entry not found', statusCode: 404 });
      return;
    }

    // return the updated media entry
    res.status(200).json({
      success: true,
      data: updatedMediaEntry,
      message: 'Media entry updated successfully',
    });
  } catch (err) {
    //handle unexpected errors
    handleError(res, { error: err });
  }
};

//delete a user media entry
export const deleteUserMediaEntry = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get media entry id
    const { id } = req.params;
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid media entry id', statusCode: 400 });
      return;
    }

    // delete the media entry
    const deletedMediaEntry = await MediaEntry.findOneAndDelete({
      _id: id,
      user: req.userData?._id,
    })
      .lean()
      .exec();

    // in case media entry is not deleted
    if (!deletedMediaEntry) {
      handleError(res, { message: 'Media entry not found', statusCode: 404 });
      return;
    }

    // return the deleted media entry
    res.status(200).json({
      success: true,
      data: deletedMediaEntry,
      message: 'Media entry deleted successfully',
    });
  } catch (err) {
    //handle unexpected errors
    handleError(res, { error: err });
  }
};
