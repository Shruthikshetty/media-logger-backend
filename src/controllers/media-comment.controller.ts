/**
 * @this file contains all the  controller's for media comments
 */

import { handleError } from '../common/utils/handle-error';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import { AddMediaCommentSchemaType } from '../common/validation-schema/media-comment/add-comment';
import { isMongoIdValid } from '../common/utils/mongo-errors';
import { HISTORY_ENTITY } from '../common/constants/model.constants';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

//controller to add a new comment
export const addMediaComment = async (
  req: ValidatedRequest<AddMediaCommentSchemaType>,
  res: Response
) => {
  try {
    const validatedData = req.validatedData!;
    //let's create a new comment
    const mockComment = {
      entityId: validatedData.entityId,
      entityType: validatedData.entityType,
      user: req.userData?._id as string,
      comment: validatedData.comment,
      username: req.userData?.name,
      profileImg: req.userData?.profileImg,
    };

    //call convex mutation!
    const commentId = await convex.mutation(
      api.services.comments.createMediaCommentMutation,
      mockComment
    );

    res.status(201).json({
      success: true,
      data: { commentId },
      message: 'Comment added successfully',
    });
  } catch (err) {
    //catch any unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//get media comments by id
export const getMediaComments = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get the mock entity id and entity type from params
    const { entityId, entityType, limit, cursor } = req.query as {
      entityId?: string;
      entityType?: string;
      limit?: string;
      cursor?: string;
    };

    // validate params
    if (!entityId || isMongoIdValid(entityId) === false) {
      handleError(res, { message: 'Invalid entity id', statusCode: 400 });
      return;
    }

    if (!entityType || !HISTORY_ENTITY.includes(entityType)) {
      handleError(res, { message: 'Invalid entity type', statusCode: 400 });
      return;
    }

    // parse limit
    let parsedLimit = Number(limit);
    if (!limit || isNaN(parsedLimit)) {
      parsedLimit = undefined;
    }

    // call convex query!
    const comments = await convex.query(
      api.services.comments.getMediaCommentsQuery,
      {
        entityId: entityId,
        entityType,
        limit: parsedLimit,
        cursor,
      }
    );
    //@TODO: send response in required format
    // send the response
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (err) {
    //catch any unexpected error
    handleError(res, {
      error: err,
    });
  }
};
