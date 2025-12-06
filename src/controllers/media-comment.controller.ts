/**
 * @this file contains all the  controller's for media comments
 */

import { handleError } from '../common/utils/handle-error';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';
import convex from '../common/config/convex.config';
import { api } from 'media-logger-convex-api-services';
import { AddMediaCommentSchemaType } from '../common/validation-schema/media-comment/add-comment';
import { isMongoIdValid } from '../common/utils/mongo-errors';
import { HISTORY_ENTITY } from '../common/constants/model.constants';
import { UpdateMediaCommentSchemaType } from '../common/validation-schema/media-comment/update-comment';

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
      user: req.userData?._id.toString(),
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

//get media comment by id
export const getMediaCommentById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get if from param
    const { id } = req.params;

    if (!id) {
      handleError(res, { message: 'Invalid comment id', statusCode: 400 });
      return;
    }

    // call convex query
    const comment = await convex.query(
      api.services.comments.getMediaCommentById,
      {
        id: id as any,
      }
    );

    if (!comment) {
      handleError(res, { message: 'Comment not found', statusCode: 404 });
      return;
    }

    // send the response
    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    //check for any validation error
    if (err?.toString()?.includes('ArgumentValidationError')) {
      handleError(res, {
        message: 'Invalid comment id',
        statusCode: 400,
      });
      return;
    }

    //catch any unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//delete media comment by id
export const deleteMediaCommentById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get if from param
    const { id } = req.params;

    if (!id) {
      handleError(res, { message: 'Invalid comment id', statusCode: 400 });
      return;
    }

    //check if comment exists or not
    const comment = await convex.query(
      api.services.comments.getMediaCommentById,
      {
        id: id as any,
      }
    );

    if (!comment) {
      handleError(res, { message: 'Comment not found', statusCode: 404 });
      return;
    }

    // call convex mutation
    await convex.mutation(api.services.comments.deleteMediaCommentById, {
      id: id as any,
    });

    // send the response
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (err) {
    //check for any validation error
    if (err?.toString()?.includes('ArgumentValidationError')) {
      handleError(res, {
        message: 'Invalid comment id',
        statusCode: 400,
      });
      return;
    }
    //catch any unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//update media comment by id
export const updateMediaCommentById = async (
  req: ValidatedRequest<UpdateMediaCommentSchemaType>,
  res: Response
) => {
  try {
    // get user id
    const userId = req.userData?._id;
    // get id from param
    const { id } = req.params;
    // get comment from validated data
    const { comment } = req.validatedData!;
    if (!id) {
      handleError(res, { message: 'Invalid comment id', statusCode: 400 });
      return;
    }

    //check if comment exists or not
    const oldComment = await convex.query(
      api.services.comments.getMediaCommentById,
      {
        id: id as any,
      }
    );

    if (!oldComment) {
      handleError(res, { message: 'Comment not found', statusCode: 404 });
      return;
    }

    if (String(oldComment?.user) != String(userId)) {
      handleError(res, {
        message: 'only comment owner can update',
        statusCode: 401,
      });
      return;
    }

    // call convex mutation to update comment
    await convex.mutation(api.services.comments.updateMediaCommentById, {
      id: id as any,
      comment,
    });

    // send the response
    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
    });
  } catch (err) {
    //check for any validation error
    if (err?.toString()?.includes('ArgumentValidationError')) {
      handleError(res, {
        message: 'Invalid comment id',
        statusCode: 400,
      });
      return;
    }
    //catch any unexpected error
    handleError(res, {
      error: err,
    });
  }
};
